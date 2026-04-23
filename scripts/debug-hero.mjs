import puppeteer from "puppeteer";

const CHROME = process.env.CHROME_PATH
  ?? "C:\Program Files\Google\Chrome\Application\chrome.exe";

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const heroImgStyle = await page.evaluate(() => {
  const img = document.querySelector(".home-hero__img");
  if (!img) return { found: false };
  const cs = window.getComputedStyle(img);
  return {
    found: true,
    objectFit: cs.objectFit,
    objectPosition: cs.objectPosition,
    width: cs.width,
    height: cs.height,
    position: cs.position,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  };
});
console.log("HERO IMAGE:", JSON.stringify(heroImgStyle, null, 2));
await browser.close();
