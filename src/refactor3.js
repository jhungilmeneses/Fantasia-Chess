import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix the second AI block:
// It has `let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, player as "w"|"b", selectedSquare as import("chess.js").Square);`
// But it should be `aiColor as "w"|"b"` and `randPiece as import("chess.js").Square)`
const ai2Regex = /let \{ newGame, actualMsg, finalSquare \} = executeDiceOfFate\(roll, player as "w"\|"b", selectedSquare as import\("chess\.js"\)\.Square\);\s*setGame\(newGame\);\s*if \(player === "w"\) \{\s*setWhiteDiceRolls\(\(prev\) => prev \+ 1\);\s*\} else \{\s*setBlackDiceRolls\(\(prev\) => prev \+ 1\);\s*\}\s*setDiceRollResult\(\{ player, dice: roll, msg: actualMsg \}\);\s*if \(roll === 2\) \{\s*setDiceGlowPiece\(\{\s*square: finalSquare,\s*turnsLeft: 2,\s*color: player,\s*\}\);\s*\}\s*setSelectedSquare\(null\);\s*setPossibleMoves\(\[\]\);/g;

const ai2Replacement = `
                  let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, aiColor as "w"|"b", randPiece as import("chess.js").Square);
                  setGame(newGame);

                  if (aiColor === "w") {
                    setWhiteDiceRolls((prev) => prev + 1);
                  } else {
                    setBlackDiceRolls((prev) => prev + 1);
                  }
                  setDiceRollResult({ player: aiColor, dice: roll, msg: actualMsg });
                  if (roll === 2) {
                    setDiceGlowPiece({
                      square: finalSquare,
                      turnsLeft: 2,
                      color: aiColor,
                    });
                  }
                  setSelectedSquare(null);
                  setPossibleMoves([]);
                  
                  setTimeout(() => {
                    setDiceRollResult(null);
                  }, 2000);
`;

content = content.replace(ai2Regex, ai2Replacement.trim());


// Fix the Player block (which was left alone!)
const playerRegex = /let actualMsg = DICE_EFFECTS\[roll\]\.desc;[\s\S]*?setPossibleMoves\(\[\]\);/g;
let pMatch = content.match(playerRegex);

if (pMatch) {
  const pReplacement = `
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
  content = content.replace(playerRegex, pReplacement.trim());
}

fs.writeFileSync('src/App.tsx', content, 'utf-8');
