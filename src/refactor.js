import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add royalPanic state
const stateInsertionPoint = `const [skillUses, setSkillUses] = useState<{`;
const stateInjection = `  const [royalPanic, setRoyalPanic] = useState<{ color: string; turnsLeft: number } | null>(null);\n  `;
if (!content.includes('const [royalPanic')) {
  content = content.replace(stateInsertionPoint, stateInjection + stateInsertionPoint);
}

// 2. Decrease royalPanic turn in handle move / AI tick
// Where they do `// Handle iron will turns`, we can do royal panic too.
const turnHandlingPoint = `// Handle Iron Will turns`;
const royalPanicHandling = `// Handle Royal Panic turns
        if (royalPanic) {
          setRoyalPanic((prev) =>
            prev && prev.turnsLeft > 1
              ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
              : prev
                ? { ...prev, turnsLeft: 0 }
                : null,
          );
        }
        
        `;
content = content.replaceAll(turnHandlingPoint, royalPanicHandling + turnHandlingPoint);

// Let's redefine executeDiceOfFate globally inside App:
const formatTimeLine = `  const formatTime = (seconds: number) => {`;
const executeHelper = `
  const executeDiceOfFate = (roll: number, playerColor: "w" | "b", targetSquare: import("chess.js").Square) => {
    let actualMsg = DICE_EFFECTS[roll]?.desc || "";
    const newGame = new Chess(game.fen());
    let finalSquare = targetSquare;
    const piece = newGame.get(targetSquare);
    if (!piece) return { newGame, actualMsg, finalSquare };

    const handleLava = (sq: string, pType: string) => {
      if (lavaTiles.some(t => t.square === sq)) {
        newGame.remove(sq as import("chess.js").Square);
        if (playerColor === 'w') setCapturedWhite(prev => [...prev, pType]);
        else setCapturedBlack(prev => [...prev, pType]);
        return true; // died
      }
      return false; 
    };

    if (roll === 1 || roll === 3 || roll === 4) {
      const fileStr = targetSquare[0];
      const rank = parseInt(targetSquare[1]);
      let dir = playerColor === "w" ? 1 : -1;
      if (roll === 4) dir = -dir; // misstep backwards
      let steps = roll === 1 ? 2 : 1;
      const newRank = rank + dir * steps;

      if (newRank >= 1 && newRank <= 8) {
        const targetSq = \`\${fileStr}\${newRank}\` as import("chess.js").Square;
        const targetPiece = newGame.get(targetSq);
        
        let canMove = false;
        if (roll === 1) {
          canMove = !targetPiece || (targetPiece.color !== playerColor && targetPiece.type !== "k");
        } else {
          canMove = !targetPiece;
        }

        if (canMove) {
          newGame.remove(targetSquare);
          let movedPiece = { ...piece };
          if (movedPiece.type === "p" && (newRank === 1 || newRank === 8)) movedPiece.type = "q";
          newGame.put(movedPiece, targetSq);
          finalSquare = targetSq;

          if (targetPiece && roll === 1) {
            if (playerColor === "w") setCapturedBlack(prev => [...prev, targetPiece.type]);
            else setCapturedWhite(prev => [...prev, targetPiece.type]);
          }

          handleLava(targetSq, movedPiece.type);
        } else {
          actualMsg += " (Failed: Blocked)";
        }
      } else {
        actualMsg += " (Failed: Edge of board)";
      }
    } else if (roll === 5) {
      const board = newGame.board();
      const allies: string[] = [];
      const fileIdx = targetSquare.charCodeAt(0);
      const rank = parseInt(targetSquare[1]);
      
      board.forEach((r, ri) => r.forEach((p, fi) => {
        if (p && p.color === playerColor) {
          const sq = \`\${String.fromCharCode(97 + fi)}\${8 - ri}\`;
          if (sq !== targetSquare) {
            const pFile = sq.charCodeAt(0);
            const pRank = parseInt(sq[1]);
            const isSelectedPawn = piece.type === 'p';
            const isTargetPawn = p.type === 'p';
            let canSwap = true;
            if (isSelectedPawn && (pRank === 1 || pRank === 8)) canSwap = false;
            if (isTargetPawn && (rank === 1 || rank === 8)) canSwap = false;

            if (canSwap && Math.max(Math.abs(pFile - fileIdx), Math.abs(pRank - rank)) <= 2) {
              allies.push(sq);
            }
          }
        }
      }));

      if (allies.length > 0) {
        const swapSqStr = allies[Math.floor(Math.random() * allies.length)];
        const swapSq = swapSqStr as import("chess.js").Square;
        const otherPiece = newGame.get(swapSq);
        newGame.remove(targetSquare);
        newGame.remove(swapSq);
        let p1 = { ...piece };
        let p2 = { ...otherPiece };
        newGame.put(p2, targetSquare);
        newGame.put(p1, swapSq);

        handleLava(swapSq, p1.type);
        handleLava(targetSquare, p2.type);

        finalSquare = swapSq;
        actualMsg += \` (Swapped with \${swapSq})\`;
      } else {
        actualMsg += " (Failed: No nearby allies)";
      }
    } else if (roll === 6) {
      setRoyalPanic({ color: playerColor, turnsLeft: 2 });
    }
    
    return { newGame, actualMsg, finalSquare };
  };
`;
if (!content.includes('executeDiceOfFate')) {
  content = content.replace(formatTimeLine, executeHelper + formatTimeLine);
}

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Successfully added executeDiceOfFate");
