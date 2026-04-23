import puppeteer from "puppeteer";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const OUT = "public/screenshots/mobile";
await (await import("node:fs/promises")).mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise(r => setTimeout(r, 4500));
// Wait for all images on page to load
await page.evaluate(async () => {
  const imgs = Array.from(document.querySelectorAll("img"));
  await Promise.all(imgs.map(img => img.complete ? null : new Promise(res => { img.onload = img.onerror = res; })));
});
await new Promise(r => setTimeout(r, 500));

await page.screenshot({ path: path.join(OUT, "hero.png") });

const sections = await page.evaluate(() => {
  return [
    { id: "sobre-mi", y: document.getElementById("sobre-mi")?.getBoundingClientRect().top + window.scrollY || 0 },
    { id: "larimar-city", y: document.getElementById("larimar-city")?.getBoundingClientRect().top + window.scrollY || 0 },
    { id: "clerhp", y: document.getElementById("clerhp")?.getBoundingClientRect().top + window.scrollY || 0 },
    { id: "articulos-y-medios", y: document.getElementById("articulos-y-medios")?.getBoundingClientRect().top + window.scrollY || 0 },
    { id: "contacto", y: document.getElementById("contacto")?.getBoundingClientRect().top + window.scrollY || 0 },
  ];
});

for (const s of sections) {
  // Scroll in steps to trigger IntersectionObserver
  await page.evaluate(async y => {
    const start = window.scrollY;
    const end = y;
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, start + (end - start) * (i / steps));
      await new Promise(r => setTimeout(r, 20));
    }
  }, s.y);
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT, `${s.id}.png`) });
  console.log(`✓ ${s.id}`);
}

// Footer
await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight - 844, behavior: "instant" }));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, "footer.png") });

await browser.close();
