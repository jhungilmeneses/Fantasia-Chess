import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/\?\s*\{[^\}]*turnsLeft:\s*0\s*\}/g, '? null');
fs.writeFileSync('src/App.tsx', content, 'utf-8');
