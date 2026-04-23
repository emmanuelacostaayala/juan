import puppeteer from "puppeteer";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/intro";

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 5000)); // wait for intro to finish

const footerY = await page.evaluate(() => {
  const footer = document.querySelector("footer");
  return footer ? footer.getBoundingClientRect().top + window.scrollY : 0;
});

await page.evaluate((y) => window.scrollTo(0, y), footerY);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "07-footer-top.png") });
console.log("✓ footer-top");

const footerH = await page.evaluate(() => document.querySelector("footer")?.scrollHeight ?? 0);
await page.evaluate((y, h) => window.scrollTo(0, y + h), footerY, footerH);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: path.join(OUT, "08-footer-bottom.png") });
console.log("✓ footer-bottom");

await browser.close();
