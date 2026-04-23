import puppeteer from "puppeteer";
import path from "node:path";

const OUT = process.env.OUT ?? "public/screenshots";
const URL = process.env.URL ?? "http://localhost:3000";
const WIDTH = 1440;

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: 900, deviceScaleFactor: 1.5 });
await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });

// Scroll slowly so IntersectionObserver fires on every section
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y <= totalHeight; y += step) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await new Promise((r) => setTimeout(r, 150));
}
// Scroll back to top and wait for all animations to complete
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 1500));

import { mkdir } from "node:fs/promises";
await mkdir(OUT, { recursive: true });

// Full page
await page.screenshot({ path: path.join(OUT, "home-full.png"), fullPage: true });
console.log("✓ home-full.png");

// Above fold only
await page.screenshot({ path: path.join(OUT, "home-fold.png"), fullPage: false });
console.log("✓ home-fold.png");

// Section screenshots
const sections = await page.evaluate(() =>
  [...document.querySelectorAll("main > section")].map((s, i) => ({
    i,
    top: s.getBoundingClientRect().top + window.scrollY,
    h: s.offsetHeight,
    cls: s.className.split(" ")[0],
  }))
);
for (const s of sections) {
  await page.evaluate((top) => window.scrollTo(0, top - 80), s.top);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, `section-${s.i}-${s.cls}.png`), fullPage: false });
  console.log(`✓ section-${s.i}-${s.cls}.png`);
}

await browser.close();
