import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  `onClick={() => {\n                        if (gameMode === "pve" && game.turn() !== playerSide)\n                          return;\n                        onSquareClick(squareName);\n                      }}`,
  `onClick={() => {\n                        if (\n                          gameMode === "pve" && \n                          game.turn() !== playerSide && \n                          !pendingMomentumJump\n                        )\n                          return;\n                        onSquareClick(squareName);\n                      }}`
);
fs.writeFileSync('src/App.tsx', content);
console.log("Fixed jump block!");
