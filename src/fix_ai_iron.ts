import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

let aiIronWillCode = `
    let timer: any;
    if (ironWill !== null && ironWill.turnsLeft === 0 && ironWill.color !== playerSide) {
      timer = setTimeout(() => {
         const available = ironWill.color === "w" ? capturedWhite : capturedBlack;
         const pickIdx = available.length > 0 ? Math.floor(Math.random() * available.length) : -1;
         
         const newGame = new Chess(game.fen());
         newGame.remove(ironWill.square as import("chess.js").Square);
         if (pickIdx !== -1) {
             const piece = available[pickIdx];
             newGame.put(
               { type: piece as any, color: ironWill.color },
               ironWill.square as import("chess.js").Square,
             );
             
             if (ironWill.color === "w") {
               const newCap = [...capturedWhite];
               newCap.splice(pickIdx, 1);
               setCapturedWhite(newCap);
             } else {
               const newCap = [...capturedBlack];
               newCap.splice(pickIdx, 1);
               setCapturedBlack(newCap);
             }
         }
         
         const tokens = newGame.fen().split(" ");
         tokens[1] = tokens[1] === "w" ? "b" : "w";
         try {
           newGame.load(tokens.join(" "));
         } catch (e) {}
         setGame(newGame);
         setIronWill(null);
      }, 1500);
    } else if (activeEvent) {
`;

content = content.replace("    let timer: any;\n    if (activeEvent) {", aiIronWillCode);

fs.writeFileSync('src/App.tsx', content);
