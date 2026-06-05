import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /if \(!gameStarted\) \{[\s\S]*?<audio ref=\{bgmRefMenu\} src="\/AUDIO\/Kubbi%20-%20Up%20In%20My%20Jam%20%20NO%20COPYRIGHT%208-bit%20Music\.mp3" autoPlay loop \/>[\s\S]*?<div className="bg-\[#2c241c\] border-4 border-\[#4a3f35\] p-6 sm:p-8 text-center flex flex-col gap-8 w-full max-w-2xl relative z-10" style=\{\{ boxShadow: "8px 8px 0px rgba\(0,0,0,0\.8\)" \}\}>\n\s*<h1 className="text-4xl sm:text-5xl md:text-6xl font-mono text-\[#d4af37\] drop-shadow-\[0_4px_4px_rgba\(0,0,0,0\.8\)\]" style=\{\{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" \}\}>Fantasia Chess<\/h1>\n\s*<div className="flex flex-col sm:flex-row gap-8 justify-center">[\s\S]*?<\/div>\n\s*<\/div>\n\s*\);\n\s*\}/;

const textToReplace = `if (!gameStarted) {
    const startGame = () => {
      playButtonSfx();
      setGame(new Chess());
      setSelectedSquare(null);
      setPossibleMoves([]);
      setWhiteTime(INITIAL_TIME);
      setBlackTime(INITIAL_TIME);
      setWhitePoints(0);
      setBlackPoints(0);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setLavaTiles([]);
      setFloodedTiles([]);
      setChaosMode(null);
      setChaosWinner(null);
      setEventWinner(null);
      setMoveCount(0);
      setImageErrors({});
      setEventTiles(generateEventTiles());
      setGameStarted(true);
      setAiMoveQueued(null);
      setWhiteDiceRolls(0);
      setBlackDiceRolls(0);
      setDiceRollResult(null);
      setActiveEvent(null);
      setIronWill(null);
      setQueenLastMoveW(null);
      setQueenLastMoveB(null);
      setHolyLightPiece(null);
      setPendingHolyLight(null);
      setActiveKnightMomentum(null);
      setPendingMomentumJump(null);
      setDiceGlowPiece(null);
      setSkillUses({w: {q:0, r:0, b:0, n:0}, b: {q:0, r:0, b:0, n:0}});
    };

    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen p-4 font-sans relative"
        style={{
           backgroundColor: '#111015',
           filter: \`brightness(\${brightness}%)\`,
           transition: 'filter 0.3s ease'
        }}
      >
        <audio ref={bgmRefMenu} src="/AUDIO/Kubbi%20-%20Up%20In%20My%20Jam%20%20NO%20COPYRIGHT%208-bit%20Music.mp3" autoPlay loop />
        <div className="bg-[#2c241c] border-4 border-[#4a3f35] p-6 sm:p-8 text-center flex flex-col gap-8 w-full max-w-2xl relative z-10" style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}>Fantasia Chess</h1>
          
          {menuStep === 'mode' && (
             <div className="flex flex-col gap-4 items-center animate-fade-in">
                <h2 className="text-2xl font-mono text-white mb-4">Select Game Mode</h2>
                <button onClick={() => { playButtonSfx(); setGameMode('pvp'); setMenuStep('pvp-factions'); }} className="w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition">Player vs Player</button>
                <button onClick={() => { playButtonSfx(); setGameMode('pve'); setMenuStep('pve-side'); }} className="w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition">Player vs AI</button>
             </div>
          )}

          {menuStep === 'pvp-factions' && (
             <div className="flex flex-col gap-8 animate-fade-in">
               <div className="flex flex-col sm:flex-row gap-8 justify-center">
                 {/* White Faction */}
                 <div className="flex-1 flex flex-col items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-mono text-white">White Pieces</h2>
                    <div className="flex flex-col gap-2 w-full">
                      <button onClick={() => { playButtonSfx(); setWhiteFaction('Human'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition-colors \${whiteFaction === 'Human' ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Humans</button>
                      <button onClick={() => { playButtonSfx(); setWhiteFaction('Elf'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition-colors \${whiteFaction === 'Elf' ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Elves</button>
                    </div>
                 </div>
                 {/* Black Faction */}
                 <div className="flex-1 flex flex-col items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-mono text-white">Black Pieces</h2>
                    <div className="flex flex-col gap-2 w-full">
                      <button onClick={() => { playButtonSfx(); setBlackFaction('Undead'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition-colors \${blackFaction === 'Undead' ? 'bg-[#8b2626] border-[#8b2626] text-white' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Undead</button>
                      <button onClick={() => { playButtonSfx(); setBlackFaction('Orc'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition-colors \${blackFaction === 'Orc' ? 'bg-[#8b2626] border-[#8b2626] text-white' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Orcs</button>
                    </div>
                 </div>
               </div>
               <div className="flex gap-4 justify-center">
                 <button onClick={() => { playButtonSfx(); setMenuStep('mode'); }} className="font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition">BACK</button>
                 <button onClick={startGame} className="font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition shadow-lg">START BATTLE</button>
               </div>
             </div>
          )}

          {menuStep === 'pve-side' && (
             <div className="flex flex-col gap-4 items-center animate-fade-in">
                <h2 className="text-2xl font-mono text-white mb-4">Choose Your Side</h2>
                <div className="flex gap-4 w-full justify-center">
                   <button onClick={() => { playButtonSfx(); setPlayerSide('w'); setMenuStep('pve-faction'); }} className="flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#d1c8b8] text-black border-4 border-[#fff] hover:bg-[#fff] transition">WHITE TEAM</button>
                   <button onClick={() => { playButtonSfx(); setPlayerSide('b'); setMenuStep('pve-faction'); }} className="flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#111] text-white border-4 border-[#000] hover:bg-[#000] transition">BLACK TEAM</button>
                </div>
                <button onClick={() => { playButtonSfx(); setMenuStep('mode'); }} className="mt-4 font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition">BACK</button>
             </div>
          )}

          {menuStep === 'pve-faction' && (
             <div className="flex flex-col gap-8 animate-fade-in">
               <h2 className="text-2xl font-mono text-white">Select Your Race</h2>
               <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
                 {playerSide === 'w' ? (
                   <>
                     <button onClick={() => { playButtonSfx(); setWhiteFaction('Human'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition-colors \${whiteFaction === 'Human' ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Humans</button>
                     <button onClick={() => { playButtonSfx(); setWhiteFaction('Elf'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition-colors \${whiteFaction === 'Elf' ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Elves</button>
                   </>
                 ) : (
                   <>
                     <button onClick={() => { playButtonSfx(); setBlackFaction('Undead'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition-colors \${blackFaction === 'Undead' ? 'bg-[#8b2626] border-[#8b2626] text-white' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Undead</button>
                     <button onClick={() => { playButtonSfx(); setBlackFaction('Orc'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition-colors \${blackFaction === 'Orc' ? 'bg-[#8b2626] border-[#8b2626] text-white' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]'}\`}>The Orcs</button>
                   </>
                 )}
               </div>
               <div className="flex gap-4 justify-center mt-4">
                 <button onClick={() => { playButtonSfx(); setMenuStep('pve-side'); }} className="font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition">BACK</button>
                 <button onClick={() => {
                     // AI chooses randomly
                     if (playerSide === 'w') {
                        setBlackFaction(Math.random() > 0.5 ? 'Undead' : 'Orc');
                     } else {
                        setWhiteFaction(Math.random() > 0.5 ? 'Human' : 'Elf');
                     }
                     startGame();
                 }} className="font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition shadow-lg">START BATTLE</button>
               </div>
             </div>
          )}

        </div>
      </div>
    );
  }`;

if (regex.test(content)) {
    content = content.replace(regex, textToReplace);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Successfully replaced menu GUI");
} else {
    console.log("Regex didn't match. Here's a snippet to debug:");
    console.log(content.substring(content.indexOf('if (!gameStarted)'), content.indexOf('if (!gameStarted)') + 500));
}
