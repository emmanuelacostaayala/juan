import puppeteer from "puppeteer";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/review";
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

// Full page screenshot
await page.screenshot({ path: path.join(OUT, "00-fullpage.png"), fullPage: true });
console.log("✓ fullpage");

// CLERHP section from the top of element
const clerhpTop = await page.evaluate(() => {
  const el = document.getElementById("clerhp");
  return el ? el.offsetTop : 0;
});
await page.evaluate(y => window.scrollTo(0, y), clerhpTop);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "clerhp-top.png") });
console.log(`✓ clerhp-top @ ${clerhpTop}`);

// Scroll to footer
await page.evaluate(() => {
  const f = document.querySelector("footer");
  if (f) window.scrollTo(0, f.offsetTop);
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "footer-top.png") });
console.log("✓ footer-top");

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "footer-bottom.png") });
console.log("✓ footer-bottom");

// Mobile view
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 45000 });
await new Promise(r => setTimeout(r, 4500));
await page.screenshot({ path: path.join(OUT, "mobile-hero.png") });
console.log("✓ mobile-hero");

await browser.close();
