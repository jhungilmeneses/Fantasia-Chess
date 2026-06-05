import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldRoll5 = `                  } else if (roll === 5) {
                    const board = newGame.board();
                    const allies: string[] = [];
                    const fileIdx = selectedSquare.charCodeAt(0);
                    const rank = parseInt(selectedSquare[1]);
                    board.forEach((r, ri) =>
                      r.forEach((p, fi) => {
                        if (p && p.color === player) {
                          const sq = \`\${String.fromCharCode(97 + fi)}\${8 - ri}\`;
                          if (sq !== selectedSquare) {
                            const pFile = sq.charCodeAt(0);
                            const pRank = parseInt(sq[1]);
                            if (
                              Math.max(
                                Math.abs(pFile - fileIdx),
                                Math.abs(pRank - rank),
                              ) <= 2
                            ) {
                              allies.push(sq);
                            }
                          }
                        }
                      }),
                    );`;

const newRoll5 = `                  } else if (roll === 5) {
                    const board = newGame.board();
                    const allies: string[] = [];
                    const fileIdx = selectedSquare.charCodeAt(0);
                    const rank = parseInt(selectedSquare[1]);
                    board.forEach((r, ri) =>
                      r.forEach((p, fi) => {
                        if (p && p.color === player) {
                          const sq = \`\${String.fromCharCode(97 + fi)}\${8 - ri}\`;
                          if (sq !== selectedSquare) {
                            const pFile = sq.charCodeAt(0);
                            const pRank = parseInt(sq[1]);
                            
                            // Prevent pawn from ending up on rank 1 or 8
                            const isSelectedPawn = piece.type === 'p';
                            const isTargetPawn = p.type === 'p';
                            let canSwap = true;
                            if (isSelectedPawn && (pRank === 1 || pRank === 8)) canSwap = false;
                            if (isTargetPawn && (rank === 1 || rank === 8)) canSwap = false;

                            if (
                              canSwap &&
                              Math.max(
                                Math.abs(pFile - fileIdx),
                                Math.abs(pRank - rank),
                              ) <= 2
                            ) {
                              allies.push(sq);
                            }
                          }
                        }
                      }),
                    );`;

if (content.includes(oldRoll5)) {
    content = content.replace(oldRoll5, newRoll5);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Fixed Roll 5 logic!");
} else {
    console.log("Could not find old Roll 5 logic.");
}
