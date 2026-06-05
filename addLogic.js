import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Also remove old injection if i accidentally run it twice, but I didn't run it yet.
content = content.replace(
  "const [gameStarted, setGameStarted] = useState(false);",
  "const [hasInteracted, setHasInteracted] = useState(false);\n  const [menuStep, setMenuStep] = useState<'mode' | 'pvp-factions' | 'pve-side' | 'pve-faction'>('mode');\n  const [gameMode, setGameMode] = useState<'pvp' | 'pve' | null>(null);\n  const [playerSide, setPlayerSide] = useState<'w' | 'b'>('w');\n  const [aiMoveQueued, setAiMoveQueued] = useState<import('chess.js').Move | null>(null);\n\n  const [gameStarted, setGameStarted] = useState(false);"
);

content = content.replace(
  "useEffect(() => {\n    if (bgmRefMenu.current) bgmRefMenu.current.volume = masterVolume / 100;\n    if (bgmRefGame.current) bgmRefGame.current.volume = masterVolume / 100;\n  }, [masterVolume]);",
  "useEffect(() => {\n    if (bgmRefMenu.current) bgmRefMenu.current.volume = masterVolume / 100;\n    if (bgmRefGame.current) bgmRefGame.current.volume = masterVolume / 100;\n  }, [masterVolume]);\n\n  useEffect(() => {\n    if (!gameStarted && hasInteracted && bgmRefMenu.current) {\n      bgmRefMenu.current.play().catch(() => {});\n    }\n  }, [hasInteracted, gameStarted]);"
);

const aiCode = `
  // --- AI LOGIC ---
  useEffect(() => {
     if (gameMode === 'pve' && gameStarted && game.turn() !== playerSide && !aiMoveQueued) {
         if (checkIsGameOver() || isMenuOpen || pendingPromotion || activeEvent || isRollingDice || pendingHolyLight || pendingMomentumJump || (ironWill !== null && ironWill.turnsLeft === 0)) return;

         const timer = setTimeout(() => {
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
  }, [gameMode, gameStarted, game.fen(), playerSide, isMenuOpen, pendingPromotion, activeEvent, isRollingDice, pendingHolyLight, pendingMomentumJump, ironWill, whitePoints, blackPoints, aiMoveQueued]);

  useEffect(() => {
     if (aiMoveQueued) {
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
  }, [aiMoveQueued, selectedSquare]);

  useEffect(() => {
    if (gameMode !== 'pve' || game.turn() === playerSide) return;
    
    let timer: any;
    if (activeEvent) {
      timer = setTimeout(() => {
         handleEventContinue();
      }, 1500);
    } else if (pendingPromotion) {
      timer = setTimeout(() => {
         const currentPoints = game.turn() === 'w' ? whitePoints : blackPoints;
         const available = ['q', 'r', 'b', 'n'].filter(t => {
            const cost = t === 'q' ? 10 : t === 'r' ? 7 : 3;
            return currentPoints >= cost;
         });
         const pick = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : 'q';
         const cost = pick === 'q' ? 10 : pick === 'r' ? 7 : 3;
         handlePromotion(pick, currentPoints >= cost ? cost : 0);
      }, 1500);
    }
    
    return () => clearTimeout(timer);
  }, [gameMode, playerSide, activeEvent, pendingPromotion, game.turn(), whitePoints, blackPoints]);
  // --- END AI LOGIC ---
`;

content = content.replace("  if (!gameStarted) {", aiCode + "\n  if (!hasInteracted) {\n    return (\n      <div \n        className=\"flex flex-col items-center justify-center min-h-screen p-4 font-sans relative cursor-pointer\"\n        style={{ backgroundColor: '#111015' }}\n        onClick={() => {\n           setHasInteracted(true);\n           playButtonSfx();\n           if (bgmRefMenu.current) bgmRefMenu.current.play().catch(()=>{});\n        }}\n      >\n        <div className=\"bg-[#2c241c] border-4 border-[#4a3f35] p-6 sm:p-8 text-center flex flex-col gap-8 w-full max-w-2xl relative z-10 transition hover:bg-[#3d3227]\" style={{ boxShadow: \"8px 8px 0px rgba(0,0,0,0.8)\" }}>\n          <h1 className=\"text-4xl sm:text-5xl md:text-6xl font-mono text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]\" style={{ textShadow: \"2px 2px 0px #5e3b12, 4px 4px 0px #000\" }}>Fantasia Chess</h1>\n          <p className=\"text-white font-mono animate-pulse text-xl\">Click Anywhere to Enter</p>\n        </div>\n      </div>\n    );\n  }\n\n  if (!gameStarted) {");


// Reset aiMoveQueued
content = content.replace(/setWhitePoints\(0\); setBlackPoints\(0\);/g, "setWhitePoints(0); setBlackPoints(0); setAiMoveQueued(null); setMenuStep('mode');");

fs.writeFileSync('src/App.tsx', content);
