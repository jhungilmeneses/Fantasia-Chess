import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const error1 = `msg: "Error: Please select one of your pieces on the board first, then roll!",
                });
                return;`;
content = content.replace(error1, `msg: "Error: Please select one of your pieces on the board first, then roll!",
                });
                setTimeout(() => setDiceRollResult(null), 3000);
                return;`);

const error2 = `msg: "Error: Please select one of your OWN pieces on the board first, then roll!",
                });
                return;`;
content = content.replace(error2, `msg: "Error: Please select one of your OWN pieces on the board first, then roll!",
                });
                setTimeout(() => setDiceRollResult(null), 3000);
                return;`);

const error3 = `msg: "Error: You cannot use the Dice of Fate on a piece that is already under the Royal Guard effect!",
                });
                return;`;
content = content.replace(error3, `msg: "Error: You cannot use the Dice of Fate on a piece that is already under the Royal Guard effect!",
                });
                setTimeout(() => setDiceRollResult(null), 3000);
                return;`);

const success = `setSelectedSquare(null);
                  setPossibleMoves([]);
                }
              }, 100);
            }}`;
content = content.replace(success, `setSelectedSquare(null);
                  setPossibleMoves([]);
                  setTimeout(() => setDiceRollResult(null), 3000);
                }
              }, 100);
            }}`);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
