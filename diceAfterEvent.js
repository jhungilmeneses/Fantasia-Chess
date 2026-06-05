import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ AI might use Dice of Fate after event[\s\S]*?\}, 2000\);/;
const replacement = `// AI might use Dice of Fate after event
             const diceRolls = aiColor === 'w' ? whiteDiceRolls : blackDiceRolls;
             // Note: Move was just made by AI, so moveCount is larger
             const maxRolls = 2 + Math.floor(Math.ceil((moveCount+1) / 2) / 7);
             if (diceRolls < maxRolls) {
                 const pieces = [];
                 game.board().forEach((row, ri) => row.forEach((p, fi) => {
                     if (p && p.color === aiColor) {
                         pieces.push(String.fromCharCode(97 + fi) + (8 - ri));
                     }
                 }));
                 if (pieces.length > 0) {
                     const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
                     setSelectedSquare(randPiece as import('chess.js').Square);
                     
                     setIsRollingDice(true);
                     let frames = 0;
                     const interval = setInterval(() => {
                         setRollingDiceValue(Math.floor(Math.random() * 6) + 1);
                         frames++;
                         if (frames > 15) {
                             clearInterval(interval);
                             setIsRollingDice(false);
                             
                             let roll = Math.floor(Math.random() * 6) + 1;
                             let actualMsg = DICE_EFFECTS[roll].desc;
                             let finalSquare = randPiece;
                             
                             if (aiColor === 'w') {
                                 setWhiteDiceRolls(prev => prev + 1);
                             } else {
                                 setBlackDiceRolls(prev => prev + 1);
                             }
                             setDiceRollResult({ player: aiColor as 'w'|'b', dice: roll, msg: actualMsg });
                             setDiceGlowPiece({ square: finalSquare, turnsLeft: 2, color: aiColor });
                             setSelectedSquare(null);
                             setPossibleMoves([]);
                             
                             setTimeout(() => {
                                 setDiceRollResult(null); 
                             }, 2000);
                         }
                     }, 100);
                 }
             }
          }, 2000);`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Successfully added AI Dice logic after event");
} else {
    console.log("Regex not found:");
}
