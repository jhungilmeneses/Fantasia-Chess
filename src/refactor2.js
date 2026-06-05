import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The AI dice logic block:
// from `let roll = Math.floor(Math.random() * 6) + 1;` 
// to `setPossibleMoves([]);`

const aiBlockRegex = /let actualMsg = DICE_EFFECTS\[roll\]\.desc;[\s\S]*?setPossibleMoves\(\[\]\);/g;

// I'll just write a script to replace the large matches.
let matches = [...content.matchAll(/let actualMsg = DICE_EFFECTS\[roll\]\.desc;[\s\S]*?setPossibleMoves\(\[\]\);/g)];

if (matches.length >= 2) {
  // matches[0] is AI
  const replacementAI = `
                let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, game.turn() as "w"|"b", randPiece as import("chess.js").Square);
                setGame(newGame);

                let diceColor = game.turn();
                if (diceColor === "w") {
                  setWhiteDiceRolls((prev) => prev + 1);
                } else {
                  setBlackDiceRolls((prev) => prev + 1);
                }
                setDiceRollResult({
                  player: diceColor as "w" | "b",
                  dice: roll,
                  msg: actualMsg,
                });
                if (roll === 2) {
                  setDiceGlowPiece({
                    square: finalSquare,
                    turnsLeft: 2,
                    color: diceColor,
                  });
                }
                setSelectedSquare(null);
                setPossibleMoves([]);
`;

  // matches[1] is Player
  const replacementPlayer = `
                  let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, player as "w"|"b", selectedSquare as import("chess.js").Square);
                  setGame(newGame);

                  if (player === "w") {
                    setWhiteDiceRolls((prev) => prev + 1);
                  } else {
                    setBlackDiceRolls((prev) => prev + 1);
                  }
                  setDiceRollResult({ player, dice: roll, msg: actualMsg });
                  if (roll === 2) {
                    setDiceGlowPiece({
                      square: finalSquare,
                      turnsLeft: 2,
                      color: player,
                    });
                  }
                  setSelectedSquare(null);
                  setPossibleMoves([]);
`;

  content = content.replace(matches[0][0], replacementAI.trim());
  // Need to rematch or just replace again
  content = content.replace(matches[1][0], replacementPlayer.trim());
  fs.writeFileSync('src/App.tsx', content, 'utf-8');
  console.log("Successfully replaced both blocks!");
} else {
  console.log("Could not find the blocks to replace!");
}
