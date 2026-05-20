import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIR = 'public/larimar/renders';
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.jpg'));

for (const f of files) {
  const src = path.join(DIR, f);
  const tmp = src + '.tmp';
  const buf = fs.readFileSync(src);
  const before = buf.length;
  await sharp(buf)
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(tmp);
  fs.renameSync(tmp, src);
  const after = fs.statSync(src).size;
  console.log(`${f.padEnd(34)} ${(before/1024).toFixed(0).padStart(6)}KB -> ${(after/1024).toFixed(0).padStart(5)}KB`);
}
