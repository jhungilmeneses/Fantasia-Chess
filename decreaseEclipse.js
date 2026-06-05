import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const EVENT_TYPES = \[\s*'Necromancer Circle'[\s\S]*?'Final Eclipse'\s*\];/;
const newEvents = `const EVENT_TYPES = [
    ...Array(5).fill('Necromancer Circle'),
    ...Array(5).fill('Holy Sanctuary'),
    ...Array(5).fill('Lava Crack'),
    ...Array(5).fill('Flooded Tiles'),
    ...Array(5).fill('Portal Rift'),
    ...Array(5).fill('Ancient Dragon'),
    'Final Eclipse'
  ];`;

if (regex.test(content)) {
    content = content.replace(regex, newEvents);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Updated EVENT_TYPES successfully.");
} else {
    // If not found properly, fallback attempt
    // Let's just string replace directly
    const strReplace = `const EVENT_TYPES = [
    'Necromancer Circle', 'Necromancer Circle', 'Necromancer Circle',
    'Holy Sanctuary', 'Holy Sanctuary', 'Holy Sanctuary',
    'Lava Crack', 'Lava Crack', 'Lava Crack',
    'Flooded Tiles', 'Flooded Tiles', 'Flooded Tiles',
    'Portal Rift', 'Portal Rift', 'Portal Rift',
    'Ancient Dragon', 'Ancient Dragon', 'Ancient Dragon',
    'Final Eclipse'
  ];`;
    if (content.includes(strReplace)) {
        content = content.replace(strReplace, newEvents);
        fs.writeFileSync('src/App.tsx', content);
        console.log("Updated EVENT_TYPES successfully by exact string.");
    } else {
        console.log("Failed to update EVENT_TYPES");
    }
}
