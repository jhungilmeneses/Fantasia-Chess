import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

let aiMoveBlock = `
            // Decrease modifier turns
            if (ironWill) {
              setIronWill((prev) =>
                prev && prev.turnsLeft > 1
                  ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
                  : prev
                    ? { ...prev, turnsLeft: 0 }
                    : null,
              );
            }

            if (holyLightPiece && holyLightPiece.color !== moveResult.color) {
              setHolyLightPiece((prev) =>
                prev && prev.turnsLeft > 1
                  ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
                  : null,
              );
            } else if (
              holyLightPiece &&
              holyLightPiece.color === moveResult.color &&
              holyLightPiece.turnsLeft <= 1
            ) {
              setHolyLightPiece(null);
            }

            if (
              moveResult &&
              moveResult.piece === "n" &&
              activeKnightMomentum === moveResult.from
            ) {
              setPendingMomentumJump({
                square: moveResult.to,
                color: moveResult.color,
              });
              setActiveKnightMomentum(null);
            }

            // Handle dice glow turns`;

// Find the string inside the useEffect 
content = content.replace("            // Handle dice glow turns\n            if (diceGlowPiece) {\n              setDiceGlowPiece((prev) => {\n                if (!prev || prev.turnsLeft <= 1) return null;\n                let nextSquare = prev.square;\n                if (prev.square === moveResult.from)", aiMoveBlock + "\n            if (diceGlowPiece) {\n              setDiceGlowPiece((prev) => {\n                if (!prev || prev.turnsLeft <= 1) return null;\n                let nextSquare = prev.square;\n                if (prev.square === moveResult.from)");

fs.writeFileSync('src/App.tsx', content);
