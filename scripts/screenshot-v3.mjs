import puppeteer from "puppeteer";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/v3";
await (await import("node:fs/promises")).mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 4500));

// Get real document dimensions
const metrics = await page.evaluate(() => {
  const footer = document.querySelector("footer");
  const clerhp = document.getElementById("clerhp");
  return {
    scrollHeight: document.documentElement.scrollHeight,
    clerhpTop: clerhp ? clerhp.getBoundingClientRect().top + window.scrollY : -1,
    clerhpHeight: clerhp ? clerhp.offsetHeight : -1,
    footerTop: footer ? footer.getBoundingClientRect().top + window.scrollY : -1,
    footerHeight: footer ? footer.offsetHeight : -1,
  };
});
console.log("metrics:", metrics);

// CLERHP — scroll so clerhp top is at viewport top
await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), metrics.clerhpTop);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "clerhp.png") });
console.log(`✓ clerhp @ ${metrics.clerhpTop}`);

// CLERHP — middle of section
await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), metrics.clerhpTop + 200);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "clerhp-mid.png") });

// Footer top
await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), metrics.footerTop);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "footer-links.png") });
console.log(`✓ footer @ ${metrics.footerTop}`);

// Footer — wordmark area
await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), metrics.footerTop + 300);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "footer-wordmark.png") });

// Very bottom
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, "footer-bottom.png") });

await browser.close();
