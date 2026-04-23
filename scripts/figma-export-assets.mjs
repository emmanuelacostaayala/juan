import fs from "node:fs/promises";
import path from "node:path";

const PAT = process.env.FIGMA_PAT;
const FILE_KEY = "sx0F0PWf14U23sEJxhIp1B";
const OUT_DIR = "public/figma-jar";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retry = async (fn, { tries = 5, base = 2000 } = {}) => {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      await sleep(base * 2 ** i + Math.random() * 500);
      process.stdout.write("!");
    }
  }
  throw lastErr;
};

const api = (p) =>
  retry(() =>
    fetch(`https://api.figma.com/v1${p}`, {
      headers: { "X-Figma-Token": PAT },
    }).then(async (r) => {
      if (!r.ok) throw new Error(`${r.status} on ${p}`);
      return r.json();
    }),
  );

const download = async (url, dest) => {
  try {
    const st = await fs.stat(dest);
    if (st.size > 0) return "cached";
  } catch {}
  return retry(async () => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`dl ${r.status}`);
    await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
    return "ok";
  });
};

const walkImageRefs = (node, out = new Map(), pathParts = []) => {
  const here = [...pathParts, node.name ?? node.id];
  for (const fill of node.fills ?? []) {
    if (fill.type === "IMAGE" && fill.imageRef) {
      const existing = out.get(fill.imageRef);
      if (!existing || here.length < existing.path.length) {
        out.set(fill.imageRef, {
          ref: fill.imageRef,
          nodeId: node.id,
          nodeName: node.name,
          path: here,
        });
      }
    }
  }
  for (const c of node.children ?? []) walkImageRefs(c, out, here);
  return out;
};

async function main() {
  await fs.mkdir(path.join(OUT_DIR, "assets"), { recursive: true });
  const file = JSON.parse(
    await fs.readFile(path.join(OUT_DIR, "file.json"), "utf8"),
  );

  const refs = new Map();
  for (const page of file.document.children ?? []) walkImageRefs(page, refs);
  console.log(`→ ${refs.size} unique image refs`);

  const refResp = await api(`/files/${FILE_KEY}/images`);
  const refUrls = refResp.meta?.images ?? {};
  console.log(`→ ${Object.keys(refUrls).length} download URLs available`);

  const manifest = [];
  let i = 0;
  for (const [ref, meta] of refs) {
    i++;
    const url = refUrls[ref];
    if (!url) {
      console.log(`  skip ${ref} (no URL)`);
      continue;
    }
    // Figma S3 URLs have no file extension — detect from Content-Type or default to png
    let ext = "png";
    try {
      const head = await fetch(url, { method: "HEAD" });
      const ct = head.headers.get("content-type") ?? "";
      if (ct.includes("jpeg") || ct.includes("jpg")) ext = "jpg";
      else if (ct.includes("webp")) ext = "webp";
    } catch {}
    const fname = `${ref}.${ext}`;
    const dest = path.join(OUT_DIR, "assets", fname);
    try {
      const result = await download(url, dest);
      const st = await fs.stat(dest);
      manifest.push({
        ref,
        file: `assets/${fname}`,
        bytes: st.size,
        nodeName: meta.nodeName,
        path: meta.path,
      });
      console.log(`  [${i}/${refs.size}] ${result} ${fname} (${(st.size / 1024).toFixed(0)}KB) ← "${meta.nodeName}"`);
    } catch (e) {
      console.warn(`  fail ${ref}: ${e.message}`);
    }
    await sleep(300);
  }

  await fs.writeFile(
    path.join(OUT_DIR, "assets-manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`✓ ${manifest.length} assets saved`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
