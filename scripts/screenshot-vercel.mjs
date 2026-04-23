import puppeteer from "puppeteer";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/vercel";
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

await page.goto("https://juanandres.vercel.app/", { waitUntil: "networkidle0", timeout: 30000 });

// Close popup if it appears
await new Promise((r) => setTimeout(r, 3500));
try {
  await page.click("[aria-label='Close'], button[class*='close'], button[class*='Close'], .modal-close, [data-dismiss], button:has(svg)");
  console.log("popup closed");
} catch {}
// Try clicking the X button by evaluating
await page.evaluate(() => {
  // Find any button that looks like a close button
  const btns = [...document.querySelectorAll("button")];
  const closeBtn = btns.find(b =>
    b.textContent.trim() === "×" || b.textContent.trim() === "✕" ||
    b.textContent.trim() === "X" || b.getAttribute("aria-label")?.toLowerCase().includes("close") ||
    b.className.toLowerCase().includes("close")
  );
  if (closeBtn) { closeBtn.click(); return "closed"; }
  return "not found";
});
await new Promise((r) => setTimeout(r, 500));

await page.screenshot({ path: path.join(OUT, "hero-settled.png"), fullPage: false });
console.log("✓ hero-settled.png");

// Full page
await page.screenshot({ path: path.join(OUT, "full-nopopup.png"), fullPage: true });
console.log("✓ full-nopopup.png");

await browser.close();
