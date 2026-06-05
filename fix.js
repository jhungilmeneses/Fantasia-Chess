import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /try \{ newGame\.load\(tokens\.join\(' '\)\); \} catch \(e\) \{\}\n\s+setGame\(newGame\);\n\s+\} else \{\n\s+actualMsg \+= " \(Failed: Blocked\)";\n\s+\}\n\s+\} else \{\n\s+actualMsg \+= " \(Failed: Edge of board\)";\n\s+\}\n\s+\} else if \(roll === 4\) \{/g,
  `try { newGame.load(tokens.join(' ')); } catch (e) {}\n                                       setGame(newGame);\n                                       finalSquare = targetSq;\n                                   } else {\n                                       actualMsg += " (Failed: Blocked)";\n                                   }\n                               } else {\n                                   actualMsg += " (Failed: Edge of board)";\n                               }\n                           } else if (roll === 4) {`
);

content = content.replace(
  /try \{ newGame\.load\(tokens\.join\(' '\)\); \} catch \(e\) \{\}\n\s+setGame\(newGame\);\n\s+\} else \{\n\s+actualMsg \+= " \(Failed: Blocked\)";\n\s+\}\n\s+\} else \{\n\s+actualMsg \+= " \(Failed: Edge of board\)";\n\s+\}\n\s+\} else if \(roll === 5\) \{/g,
  `try { newGame.load(tokens.join(' ')); } catch (e) {}\n                                       setGame(newGame);\n                                       finalSquare = targetSq;\n                                   } else {\n                                       actualMsg += " (Failed: Blocked)";\n                                   }\n                               } else {\n                                   actualMsg += " (Failed: Edge of board)";\n                               }\n                           } else if (roll === 5) {`
);

content = content.replace(
  /try \{ newGame\.load\(tokens\.join\(' '\)\); \} catch \(e\) \{\}\n\s+setGame\(newGame\);\n\s+actualMsg \+= \` \(Swapped with \$\{swapSq\}\)\`;/g,
  `try { newGame.load(tokens.join(' ')); } catch (e) {}\n                                   \n                                   setGame(newGame);\n                                   finalSquare = swapSq;\n                                   actualMsg += \` (Swapped with \${swapSq})\`;`
);

content = content.replace(
  /setDiceRollResult\(\{ player, dice: roll, msg: actualMsg \}\);\n\s+setSelectedSquare\(null\);\n\s+setPossibleMoves\(\[\]\);/g,
  `setDiceRollResult({ player, dice: roll, msg: actualMsg });\n                            setDiceGlowPiece({ square: finalSquare, turnsLeft: 2, color: player });\n                            setSelectedSquare(null);\n                            setPossibleMoves([]);`
);

fs.writeFileSync('src/App.tsx', content);
