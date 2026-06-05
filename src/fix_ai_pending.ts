import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

let aiPendingCode = `
    } else if (pendingMomentumJump && pendingMomentumJump.color !== playerSide) {
      timer = setTimeout(() => {
        const knightSquare = pendingMomentumJump.square;
        const knFile = knightSquare.charCodeAt(0);
        const knRank = parseInt(knightSquare[1]);

        let targets: string[] = [];
        const possibleJumps = [
          [2, 1],
          [2, -1],
          [-2, 1],
          [-2, -1],
          [1, 2],
          [1, -2],
          [-1, 2],
          [-1, -2],
        ];

        possibleJumps.forEach((j) => {
          const f = String.fromCharCode(knFile + j[0]);
          const r = knRank + j[1];
          if (f >= "a" && f <= "h" && r >= 1 && r <= 8) {
            targets.push(f + r);
          }
        });

        const targetSq = targets[Math.floor(Math.random() * targets.length)];
        
        // Damage target
        const newGame = new Chess(game.fen());
        const targetPiece = newGame.get(targetSq as import("chess.js").Square);

        if (targetPiece && targetPiece.color !== pendingMomentumJump.color) {
          newGame.remove(targetSq as import("chess.js").Square);
          const points = PIECE_VALUES[targetPiece.type] || 0;
          if (pendingMomentumJump.color === "w") {
            setWhitePoints((prev) => prev + points);
            setCapturedBlack((prev) => [...prev, targetPiece.type]);
          } else {
            setBlackPoints((prev) => prev + points);
            setCapturedWhite((prev) => [...prev, targetPiece.type]);
          }
          const tokens = newGame.fen().split(" ");
          tokens[3] = "-";
          try {
            newGame.load(tokens.join(" "));
          } catch (e) {}
          setGame(newGame);
        }

        setTimeout(() => setCaptureAnim(null), 600);
        setCaptureAnim({ square: targetSq, id: Date.now() });

        setPendingMomentumJump(null);
      }, 1500);
    } else if (pendingHolyLight && pendingHolyLight.color !== playerSide) {
      // Actually AI never sets pendingHolyLight manually since it doesn't click to cast skills. 
      // But just in case.
`;

content = content.replace("    } else if (activeEvent) {", aiPendingCode + "\n    } else if (activeEvent) {");

fs.writeFileSync('src/App.tsx', content);
