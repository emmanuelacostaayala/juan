import puppeteer from "puppeteer";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/scroll";
await (await import("node:fs/promises")).mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 5000)); // skip intro

// Take screenshots at different scroll positions to find the white gap
const positions = [0, 500, 900, 1300, 1700, 2100, 2500, 3000];
for (let i = 0; i < positions.length; i++) {
  const y = positions[i];
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, `scroll-${String(y).padStart(5, "0")}.png`) });
  console.log(`✓ scroll-${y}`);
}

// Also get section boundaries
const sections = await page.evaluate(() => {
  const main = document.querySelector("main");
  if (!main) return [];
  return Array.from(main.children).map((el, i) => ({
    i,
    tag: el.tagName,
    cls: el.className,
    top: el.offsetTop,
    height: el.offsetHeight,
  }));
});
console.log("sections:", JSON.stringify(sections, null, 2));

await browser.close();
