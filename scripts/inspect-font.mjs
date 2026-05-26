import fs from 'fs';

const path = process.argv[2] || 'public/fonts/NeueHaasDisplayRoman.ttf';
const buf = fs.readFileSync(path);
const numTables = buf.readUInt16BE(4);
let nameOffset = -1, nameLength = -1;
for (let i = 0; i < numTables; i++) {
  const tagOff = 12 + i * 16;
  const tag = buf.slice(tagOff, tagOff + 4).toString('ascii');
  if (tag === 'name') {
    nameOffset = buf.readUInt32BE(tagOff + 8);
    nameLength = buf.readUInt32BE(tagOff + 12);
    break;
  }
}
const tbl = buf.slice(nameOffset, nameOffset + nameLength);
const count = tbl.readUInt16BE(2);
const storage = tbl.readUInt16BE(4);
const NAME_IDS = { 1: 'Family', 2: 'Subfamily', 4: 'Full', 6: 'PostScript', 16: 'TypoFamily', 17: 'TypoSubfamily' };
console.log('=== ' + path + ' ===');
for (let i = 0; i < count; i++) {
  const rec = 6 + i * 12;
  const platformID = tbl.readUInt16BE(rec);
  const nameID = tbl.readUInt16BE(rec + 6);
  const len = tbl.readUInt16BE(rec + 8);
  const off = tbl.readUInt16BE(rec + 10);
  if (!NAME_IDS[nameID]) continue;
  if (platformID !== 3) continue;
  const str = tbl.slice(storage + off, storage + off + len).toString('utf16le');
  console.log(NAME_IDS[nameID] + ': ' + str);
}
