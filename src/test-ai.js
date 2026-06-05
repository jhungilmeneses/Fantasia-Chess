const fs = require('fs');

let fileStr = fs.readFileSync('src/App.tsx', 'utf8');

// The bug might just be that the game locks up. Let me add console logs to AI decision-making.
