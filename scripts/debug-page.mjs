import puppeteer from "puppeteer";

const CHROME = process.env.CHROME_PATH
  ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));

const info = await page.evaluate(() => {
  const main = document.querySelector("main");
  const sections = document.querySelectorAll("main > section");
  return {
    hasMain: !!main,
    mainChildCount: main ? main.children.length : 0,
    sectionCount: sections.length,
    sectionClasses: [...sections].map((s) => s.className),
    bodyTextSnippet: document.body.innerText.slice(0, 150),
  };
});
console.log("PAGE INFO:", JSON.stringify(info, null, 2));
console.log("CONSOLE ERRORS:", JSON.stringify(consoleErrors.slice(0, 5), null, 2));
await browser.close();
