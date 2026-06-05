import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const strQueenReplace = `                                    const tokens = newGame.fen().split(" ");
                                    tokens[1] = tokens[1] === "w" ? "b" : "w";
                                    tokens[3] = "-";
                                    newGame.load(tokens.join(" "));`;

const strQueenNew = `                                    const tokens = newGame.fen().split(" ");
                                    tokens[1] = tokens[1] === "w" ? "b" : "w";
                                    tokens[2] = "-"; // clear castling rights upon teleport
                                    tokens[3] = "-";
                                    try { newGame.load(tokens.join(" ")); } catch(e) { console.error("Q skill load:", e); }`;


const strRookReplace = `                                    const tokens = newGame.fen().split(" ");
                                    tokens[1] = tokens[1] === "w" ? "b" : "w";
                                    tokens[3] = "-";
                                    newGame.load(tokens.join(" "));`;

content = content.replace(strQueenReplace, strQueenNew);
content = content.replace(strRookReplace, strQueenNew);

fs.writeFileSync('src/App.tsx', content);
console.log("Fixed teleport load crashes!");
