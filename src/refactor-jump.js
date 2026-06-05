import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `!lavaTiles.some(t => t.square === square)) {`;
const replace = `!lavaTiles.some(t => t.square === square) && !floodedTiles.some(t => t.square === square)) {`;
if (content.includes(target)) {
  content = content.replace(target, replace);
}
fs.writeFileSync('src/App.tsx', content, 'utf-8');
