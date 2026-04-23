import fs from "node:fs/promises";
import path from "node:path";

const file = JSON.parse(
  await fs.readFile("public/figma-jar/file.json", "utf8"),
);

const fonts = new Map();
const colors = new Map();
const texts = [];

const hex = ({ r, g, b, a = 1 }) => {
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return a < 0.99 ? `rgba(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)},${a.toFixed(2)})` : `#${to(r)}${to(g)}${to(b)}`;
};

const walkNode = (node, depth = 0, pageName = "") => {
  // Collect text
  if (node.type === "TEXT" && node.characters) {
    const s = node.style ?? {};
    texts.push({
      page: pageName,
      depth,
      id: node.id,
      name: node.name,
      text: node.characters.slice(0, 120),
      font: s.fontFamily,
      size: s.fontSize,
      weight: s.fontWeight,
      lineH: s.lineHeightPx,
      align: s.textAlignHorizontal,
    });
    if (s.fontFamily) {
      const key = `${s.fontFamily} ${s.fontWeight ?? ""}`.trim();
      fonts.set(key, (fonts.get(key) ?? new Set()).add(s.fontSize));
    }
  }

  // Collect fills
  for (const fill of node.fills ?? []) {
    if (fill.type === "SOLID" && fill.color) {
      const c = hex(fill.color);
      colors.set(c, (colors.get(c) ?? 0) + 1);
    }
  }

  for (const c of node.children ?? []) walkNode(c, depth + 1, pageName);
};

for (const page of file.document.children ?? []) {
  for (const c of page.children ?? []) walkNode(c, 0, page.name);
}

console.log("\n══ FONTS ══");
for (const [name, sizes] of [...fonts.entries()].sort()) {
  console.log(`  ${name}: ${[...sizes].sort((a, b) => b - a).join(", ")}px`);
}

console.log("\n══ FILL COLORS (top 20) ══");
const topColors = [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
for (const [c, n] of topColors) console.log(`  ${c} ×${n}`);

console.log("\n══ TEXTS (home page, first 40) ══");
const homeTexts = texts.filter((t) => t.page === "Web JAR Final").slice(0, 40);
for (const t of homeTexts) {
  console.log(`  [${t.size}px ${t.weight} ${t.font}] "${t.text.replace(/\n/g, " ")}"`);
}
