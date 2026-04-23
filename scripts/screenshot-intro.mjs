import puppeteer from "puppeteer";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/intro";
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });

// Immediately — intro visible, text animating in
await page.screenshot({ path: path.join(OUT, "01-intro-start.png") });
console.log("✓ 01-intro-start.png");

// 1200ms — text fully visible
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: path.join(OUT, "02-intro-full.png") });
console.log("✓ 02-intro-full.png");

// 3500ms — exit animation starting
await new Promise(r => setTimeout(r, 2300));
await page.screenshot({ path: path.join(OUT, "03-intro-exiting.png") });
console.log("✓ 03-intro-exiting.png");

// 4500ms — hero section visible
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: path.join(OUT, "04-hero.png") });
console.log("✓ 04-hero.png");

// Header strip
await page.screenshot({ path: path.join(OUT, "05-header.png"), clip: { x: 0, y: 0, width: 1440, height: 130 } });
console.log("✓ 05-header.png");

await browser.close();
console.log("Done.");
