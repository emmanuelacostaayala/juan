import puppeteer from "puppeteer";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
const failed = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("requestfailed", (req) => failed.push({ url: req.url(), reason: req.failure()?.errorText }));

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });

// Scroll through page
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= total; y += 400) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await new Promise((r) => setTimeout(r, 200));
}
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 2000));

console.log("CONSOLE ERRORS:", JSON.stringify(errors, null, 2));
console.log("FAILED REQUESTS:", JSON.stringify(failed, null, 2));

// Check hero image styles
const heroImg = await page.evaluate(() => {
  const img = document.querySelector(".home-hero__img");
  if (!img) return { found: false };
  const cs = window.getComputedStyle(img);
  return {
    found: true,
    objectFit: cs.objectFit,
    objectPosition: cs.objectPosition,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  };
});
console.log("HERO IMG:", JSON.stringify(heroImg, null, 2));

await browser.close();
