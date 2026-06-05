import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ --- AI LOGIC ---[\s\S]*?\/\/ --- END AI LOGIC ---/;

const aiCode = `// --- AI LOGIC ---
  useEffect(() => {
     if (gameMode === 'pve' && gameStarted && game.turn() !== playerSide && !aiMoveQueued) {
         if (checkIsGameOver() || isMenuOpen || pendingPromotion || activeEvent || isRollingDice || pendingHolyLight || pendingMomentumJump || (ironWill !== null && ironWill.turnsLeft === 0)) return;

         const timer = setTimeout(() => {
              // Roll dice of fate randomly if AI has uses available (25% chance per turn)
              const aiColor = game.turn();
              const diceRolls = aiColor === 'w' ? whiteDiceRolls : blackDiceRolls;
              const maxRolls = 2 + Math.floor(Math.ceil(moveCount / 2) / 7);
              if (diceRolls < maxRolls && Math.random() < 0.25) {
                  // Find a piece to apply the dice effect
                  const pieces = [];
                  game.board().forEach((row, ri) => row.forEach((p, fi) => {
                      if (p && p.color === aiColor) {
                          pieces.push(String.fromCharCode(97 + fi) + (8 - ri));
                      }
                  }));
                  if (pieces.length > 0) {
                      const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
                      setSelectedSquare(randPiece as import('chess.js').Square);
                      
                      // Trigger dice
                      setIsRollingDice(true);
                      let frames = 0;
                      const interval = setInterval(() => {
                          setRollingDiceValue(Math.floor(Math.random() * 6) + 1);
                          frames++;
                          if (frames > 15) {
                              clearInterval(interval);
                              setIsRollingDice(false);
                              
                              let roll = Math.floor(Math.random() * 6) + 1;
                              let actualMsg = DICE_EFFECTS[roll].desc;
                              const newGame = new Chess(game.fen());
                              let finalSquare = randPiece;

                              if (roll === 3) {
                                  // Swift Advance
                                  // Simplistic resolution for AI: ignore or apply if possible
                              } else if (roll === 5) {
                                  // Position Shift
                              }
                              
                              let diceColor = game.turn();
                              if (diceColor === 'w') {
                                  setWhiteDiceRolls(prev => prev + 1);
                              } else {
                                  setBlackDiceRolls(prev => prev + 1);
                              }
                              setDiceRollResult({ player: diceColor as 'w'|'b', dice: roll, msg: actualMsg });
                              setDiceGlowPiece({ square: finalSquare, turnsLeft: 2, color: diceColor });
                              setSelectedSquare(null);
                              setPossibleMoves([]);
                              
                              // Now wait before generating move
                              setTimeout(() => {
                                  setDiceRollResult(null); // dismiss popup
                              }, 2000);
                          }
                      }, 100);
                      return; // Wait for next effect to generate move
                  }
              }

              // Decide move
              let moves = game.moves({ verbose: true }) as import('chess.js').Move[];
              const aiPoints = game.turn() === 'w' ? whitePoints : blackPoints;
              if (aiPoints < 3) moves = moves.filter((m: any) => !m.promotion);
              if (moves.length === 0) moves = game.moves({ verbose: true }) as import('chess.js').Move[];
              if (moves.length === 0) return;
              
              const captures = moves.filter((m: any) => m.captured);
              const m = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : moves[Math.floor(Math.random() * moves.length)];
              setAiMoveQueued(m);
         }, 1000);
         return () => clearTimeout(timer);
     }
  }, [gameMode, gameStarted, game.fen(), playerSide, isMenuOpen, pendingPromotion, activeEvent, isRollingDice, pendingHolyLight, pendingMomentumJump, ironWill, whitePoints, blackPoints, aiMoveQueued, whiteDiceRolls, blackDiceRolls, moveCount]);

  useEffect(() => {
     if (aiMoveQueued && !isRollingDice && !diceRollResult) { // Ensure AI isn't showing dice popup
         if (!selectedSquare || selectedSquare !== aiMoveQueued.from) {
             onSquareClick(aiMoveQueued.from as import('chess.js').Square); // Selects piece
         } else {
             // Let UI render the selection for 500ms
             const timer = setTimeout(() => {
                 onSquareClick(aiMoveQueued.to as import('chess.js').Square); // Makes move
                 setAiMoveQueued(null); // Clear queue
             }, 600);
             return () => clearTimeout(timer);
         }
     }
  }, [aiMoveQueued, selectedSquare, isRollingDice, diceRollResult]);

  useEffect(() => {
    if (gameMode !== 'pve') return;
    
    let timer: any;
    const aiColor = playerSide === 'w' ? 'b' : 'w';
    
    if (activeEvent) {
      const piece = game.get(activeEvent.square as import('chess.js').Square);
      // Determine if AI triggered the event. Usually whoever's turn it is NOT triggered it.
      // E.g. game.turn() is playerSide now, which means AI just ended its turn and triggered the event.
      const triggerColor = piece ? piece.color : (game.turn() === 'w' ? 'b' : 'w');
      
      if (triggerColor === aiColor) {
          timer = setTimeout(() => {
             handleEventContinue();
             
             // AI might use Dice of Fate after event
             const diceRolls = aiColor === 'w' ? whiteDiceRolls : blackDiceRolls;
             const maxRolls = 2 + Math.floor(Math.ceil((moveCount+1) / 2) / 7);
             if (diceRolls < maxRolls && Math.random() < 0.5) {
                 // Close event, then on AI's next turn it can use dice? But wait, handleEventContinue passes turn to player. AI can't use dice when it's player's turn!
                 // BUT Dice of fate can be used by AI during its turn. We've implemented general dice logic above!
             }
          }, 2000);
      }
    } else if (pendingPromotion) {
      // Check if the promotion is for AI
      const isAIPromotion = pendingPromotion.moves[0].color === aiColor;
      if (isAIPromotion) {
          timer = setTimeout(() => {
             const currentPoints = aiColor === 'w' ? whitePoints : blackPoints;
             const available = ['q', 'r', 'b', 'n'].filter(t => {
                const cost = t === 'q' ? 10 : t === 'r' ? 7 : 3;
                return currentPoints >= cost;
             });
             const pick = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : 'q';
             const cost = pick === 'q' ? 10 : pick === 'r' ? 7 : 3;
             handlePromotion(pick, currentPoints >= cost ? cost : 0);
          }, 1500);
      }
    }
    
    return () => clearTimeout(timer);
  }, [gameMode, playerSide, activeEvent, pendingPromotion, game.fen(), whitePoints, blackPoints, moveCount, whiteDiceRolls, blackDiceRolls]);
  // --- END AI LOGIC ---`;

content = content.replace(regex, aiCode);
fs.writeFileSync('src/App.tsx', content);
