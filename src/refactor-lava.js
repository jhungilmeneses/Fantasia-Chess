import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `if (isAdjacent && !game.get(square)) {`;
const replace = `if (isAdjacent && !game.get(square) && !lavaTiles.some(t => t.square === square)) {`;
if (content.includes(target)) {
  content = content.replace(target, replace);
}

// Ensure Iron Will capture condition ends the game correctly. The current eventWinner text only mentions "KING ELIMINATION".
// Let's modify the end-game condition for Iron Will captures logic.
const checkGameOverInjection = `
    let eventFinished = true;

    if (ironWill && ironWill.capturesMade >= 3) {
      if (ironWill.color === "w") setEventWinner(whiteFaction.toUpperCase());
      else setEventWinner(blackFaction.toUpperCase());
    }
`;
const insertionTarget = `let eventFinished = true;`;
content = content.replace(insertionTarget, checkGameOverInjection);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
