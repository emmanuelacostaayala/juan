import puppeteer from "puppeteer";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/full";
await (await import("node:fs/promises")).mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 45000 });
await new Promise(r => setTimeout(r, 4500)); // skip intro

// Get section boundaries
const sections = await page.evaluate(() => {
  const main = document.querySelector("main");
  if (!main) return [];
  return Array.from(main.children).map((el, i) => ({
    i,
    tag: el.tagName,
    id: el.id || "",
    cls: typeof el.className === "string" ? el.className : "",
    top: el.offsetTop,
    height: el.offsetHeight,
  }));
});
console.log("sections:", JSON.stringify(sections, null, 2));

// Screenshot each section at its top
for (const s of sections) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, s.top - 40));
  await new Promise(r => setTimeout(r, 500));
  const label = s.id || `sec-${String(s.i).padStart(2, "0")}`;
  await page.screenshot({ path: path.join(OUT, `${String(s.i).padStart(2, "0")}-${label}.png`) });
  console.log(`✓ ${label} @ ${s.top}`);
}

// Also footer
await page.evaluate(() => {
  const f = document.querySelector("footer");
  if (f) window.scrollTo(0, f.offsetTop - 20);
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "99-footer.png") });
console.log("✓ footer");

// Bottom
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "99-bottom.png"), fullPage: false });
console.log("✓ bottom");

// Test anchor links
for (const anchor of ["sobre-mi", "larimar-city", "clerhp", "articulos-y-medios", "contacto"]) {
  await page.goto(`http://localhost:3000/#${anchor}`, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT, `anchor-${anchor}.png`) });
  console.log(`✓ anchor /#${anchor}`);
}

await browser.close();
