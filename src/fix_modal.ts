import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("{ironWill !== null && ironWill.turnsLeft === 0 ? (", "{ironWill !== null && ironWill.turnsLeft === 0 && (ironWill.color === playerSide || gameMode === 'pvp') ? (");

fs.writeFileSync('src/App.tsx', content);
