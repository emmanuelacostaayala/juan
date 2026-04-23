import fs from "node:fs/promises";
import path from "node:path";

const PAT = process.env.FIGMA_PAT;
const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "sx0F0PWf14U23sEJxhIp1B";
const OUT_DIR = process.env.FIGMA_OUT ?? "public/figma-jar";
const SCALE = 2;

if (!PAT) {
  console.error("Missing FIGMA_PAT env var");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retry = async (fn, { tries = 8, base = 3000 } = {}) => {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const delay = base * 2 ** i + Math.random() * 500;
      process.stdout.write(`!`);
      await sleep(delay);
    }
  }
  throw lastErr;
};

const api = (p) =>
  retry(() =>
    fetch(`https://api.figma.com/v1${p}`, {
      headers: { "X-Figma-Token": PAT },
    }).then(async (r) => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText} on ${p}`);
      return r.json();
    }),
  );

const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60);

const download = async (url, dest) => {
  try {
    const stat = await fs.stat(dest);
    if (stat.size > 0) return "cached";
  } catch {}
  return retry(async () => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`download ${url} → ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    await fs.writeFile(dest, buf);
    return "ok";
  });
};

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

const walkFrames = (node, depth = 0, out = []) => {
  if (!node) return out;
  if (
    (node.type === "FRAME" || node.type === "COMPONENT") &&
    depth >= 1 &&
    depth <= 2
  ) {
    out.push({ id: node.id, name: node.name, depth });
  }
  for (const c of node.children ?? []) walkFrames(c, depth + 1, out);
  return out;
};

const walkImageRefs = (node, out = new Set()) => {
  for (const fill of node.fills ?? []) {
    if (fill.type === "IMAGE" && fill.imageRef) out.add(fill.imageRef);
  }
  for (const c of node.children ?? []) walkImageRefs(c, out);
  return out;
};

async function main() {
  await fs.mkdir(path.join(OUT_DIR, "frames"), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, "assets"), { recursive: true });

  const filePath = path.join(OUT_DIR, "file.json");
  let file;
  try {
    const stat = await fs.stat(filePath);
    if (stat.size > 0) {
      console.log(`→ Reusing cached file.json (${(stat.size / 1024).toFixed(1)} KB)`);
      file = JSON.parse(await fs.readFile(filePath, "utf8"));
    }
  } catch {}
  if (!file) {
    console.log("→ Fetching full file JSON…");
    file = await api(`/files/${FILE_KEY}`);
    await fs.writeFile(filePath, JSON.stringify(file, null, 2));
    console.log(`  saved file.json (${(JSON.stringify(file).length / 1024).toFixed(1)} KB)`);
  }

  const frames = [];
  for (const page of file.document.children ?? []) {
    walkFrames(page, 0, frames);
  }
  console.log(`→ Found ${frames.length} exportable frames (depth 1–2)`);

  const imageRefs = new Set();
  for (const page of file.document.children ?? []) walkImageRefs(page, imageRefs);
  console.log(`→ Found ${imageRefs.size} image refs`);

  console.log("→ Exporting frames as PNG @2x…");
  const urlMapPath = path.join(OUT_DIR, "url-map.json");
  let urlMap = {};
  try {
    urlMap = JSON.parse(await fs.readFile(urlMapPath, "utf8"));
    console.log(`  reusing ${Object.keys(urlMap).length} cached export URLs`);
  } catch {}
  const pending = frames.filter((f) => !urlMap[f.id]);
  const batches = chunk(pending, 5);
  for (const batch of batches) {
    const ids = batch.map((f) => f.id).join(",");
    const resp = await api(
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${SCALE}`,
    );
    if (resp.err) throw new Error("images err: " + resp.err);
    Object.assign(urlMap, resp.images);
    await fs.writeFile(urlMapPath, JSON.stringify(urlMap, null, 2));
    process.stdout.write("+");
    await sleep(2500);
  }
  console.log();

  console.log("→ Downloading frame PNGs…");
  const manifest = [];
  for (const f of frames) {
    const url = urlMap[f.id];
    if (!url) continue;
    const fname = `${f.id.replace(/[:]/g, "-")}__${slug(f.name) || "frame"}.png`;
    const dest = path.join(OUT_DIR, "frames", fname);
    try {
      await download(url, dest);
      manifest.push({ id: f.id, name: f.name, depth: f.depth, file: `frames/${fname}` });
      process.stdout.write(".");
    } catch (e) {
      console.warn(`\n  fail ${f.id}: ${e.message}`);
    }
  }
  console.log();

  console.log("→ Fetching asset URLs for image refs…");
  const refResp = await api(`/files/${FILE_KEY}/images`);
  const refUrls = refResp.meta?.images ?? {};

  console.log("→ Downloading embedded assets…");
  const assets = [];
  for (const ref of imageRefs) {
    const url = refUrls[ref];
    if (!url) continue;
    const ext = url.split("?")[0].split(".").pop() || "png";
    const dest = path.join(OUT_DIR, "assets", `${ref}.${ext}`);
    try {
      await download(url, dest);
      assets.push({ ref, file: `assets/${ref}.${ext}` });
      process.stdout.write(".");
    } catch (e) {
      console.warn(`\n  fail ${ref}: ${e.message}`);
    }
  }
  console.log();

  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ fileKey: FILE_KEY, frames: manifest, assets }, null, 2),
  );
  console.log(`✓ Done. ${manifest.length} frames, ${assets.length} assets in ${OUT_DIR}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
