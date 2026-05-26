import sharp from 'sharp';
import fs from 'fs';

const src = 'public/DSCF7081.jpg';
const dest = 'public/photos/hero-portrait.jpg';
const before = fs.statSync(src).size;
await sharp(fs.readFileSync(src))
  .resize({ width: 1440, withoutEnlargement: true })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(dest);
const after = fs.statSync(dest).size;
console.log(`${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB  ${dest}`);
