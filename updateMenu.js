import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{menuStep === 'mode' && \([\s\S]*?<\/div>\n\s*\)}/g;

const newMenuLogic = `{menuStep === 'mode' && (
             <div className="flex flex-col gap-5 items-center animate-fade-in">
                <h2 className="text-2xl font-mono text-white mb-4 drop-shadow-md">Select Game Mode</h2>
                <button onClick={() => { playButtonSfx(); setGameMode('pvp'); setMenuStep('pvp-factions'); }} className="w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_rgba(0,0,0,0.8)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.8)] active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)]" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>Player vs Player</button>
                <button onClick={() => { playButtonSfx(); setGameMode('pve'); setMenuStep('pve-side'); }} className="w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>Player vs AI</button>
                <button onClick={() => { playButtonSfx(); setIsSettingsOpen(true); }} className="w-64 py-4 mt-2 font-mono text-xl bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>Settings</button>
             </div>
          )}

          {menuStep === 'pvp-factions' && (
             <div className="flex flex-col gap-8 animate-fade-in">
               <div className="flex flex-col sm:flex-row gap-8 justify-center">
                 {/* White Faction */}
                 <div className="flex-1 flex flex-col items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-mono text-white">White Pieces</h2>
                    <div className="flex flex-col gap-4 w-full">
                      <button onClick={() => { playButtonSfx(); setWhiteFaction('Human'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${whiteFaction === 'Human' ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={whiteFaction === 'Human' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.5), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Humans</button>
                      <button onClick={() => { playButtonSfx(); setWhiteFaction('Elf'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${whiteFaction === 'Elf' ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={whiteFaction === 'Elf' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.5), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Elves</button>
                    </div>
                 </div>
                 {/* Black Faction */}
                 <div className="flex-1 flex flex-col items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-mono text-white">Black Pieces</h2>
                    <div className="flex flex-col gap-4 w-full">
                      <button onClick={() => { playButtonSfx(); setBlackFaction('Undead'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${blackFaction === 'Undead' ? 'bg-[#8b2626] border-[#8b2626] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={blackFaction === 'Undead' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.4), inset 2px 2px 0px rgba(255,100,100,0.4), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Undead</button>
                      <button onClick={() => { playButtonSfx(); setBlackFaction('Orc'); }} className={\`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${blackFaction === 'Orc' ? 'bg-[#8b2626] border-[#8b2626] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={blackFaction === 'Orc' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.4), inset 2px 2px 0px rgba(255,100,100,0.4), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Orcs</button>
                    </div>
                 </div>
               </div>
               <div className="flex gap-6 justify-center mt-4">
                 <button onClick={() => { playButtonSfx(); setMenuStep('mode'); }} className="font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>BACK</button>
                 <button onClick={startGame} className="font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>START BATTLE</button>
               </div>
             </div>
          )}

          {menuStep === 'pve-side' && (
             <div className="flex flex-col gap-6 items-center animate-fade-in">
                <h2 className="text-2xl font-mono text-white mb-4 drop-shadow-md">Choose Your Side</h2>
                <div className="flex gap-6 w-full justify-center">
                   <button onClick={() => { playButtonSfx(); setPlayerSide('w'); setMenuStep('pve-faction'); }} className="flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#d1c8b8] text-black border-4 border-[#fff] hover:bg-[#fff] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,1), 4px 4px 0px rgba(0,0,0,0.8)" }}>WHITE TEAM</button>
                   <button onClick={() => { playButtonSfx(); setPlayerSide('b'); setMenuStep('pve-faction'); }} className="flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#222] text-white border-4 border-[#000] hover:bg-[#000] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.8), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>BLACK TEAM</button>
                </div>
                <button onClick={() => { playButtonSfx(); setMenuStep('mode'); }} className="mt-4 font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>BACK</button>
             </div>
          )}

          {menuStep === 'pve-faction' && (
             <div className="flex flex-col gap-8 animate-fade-in">
               <h2 className="text-2xl font-mono text-white">Select Your Race</h2>
               <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                 {playerSide === 'w' ? (
                   <>
                     <button onClick={() => { playButtonSfx(); setWhiteFaction('Human'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${whiteFaction === 'Human' ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={whiteFaction === 'Human' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.5), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Humans</button>
                     <button onClick={() => { playButtonSfx(); setWhiteFaction('Elf'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${whiteFaction === 'Elf' ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={whiteFaction === 'Elf' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.2), inset 2px 2px 0px rgba(255,255,255,0.5), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Elves</button>
                   </>
                 ) : (
                   <>
                     <button onClick={() => { playButtonSfx(); setBlackFaction('Undead'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${blackFaction === 'Undead' ? 'bg-[#8b2626] border-[#8b2626] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={blackFaction === 'Undead' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.4), inset 2px 2px 0px rgba(255,100,100,0.4), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Undead</button>
                     <button onClick={() => { playButtonSfx(); setBlackFaction('Orc'); }} className={\`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 \${blackFaction === 'Orc' ? 'bg-[#8b2626] border-[#8b2626] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] shadow-[4px_4px_0px_rgba(0,0,0,0.8)]'}\`} style={blackFaction === 'Orc' ? { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.4), inset 2px 2px 0px rgba(255,100,100,0.4), 4px 4px 0px rgba(0,0,0,0.8)" } : { boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>The Orcs</button>
                   </>
                 )}
               </div>
               <div className="flex gap-6 justify-center mt-4">
                 <button onClick={() => { playButtonSfx(); setMenuStep('pve-side'); }} className="font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>BACK</button>
                 <button onClick={() => {
                     // AI chooses randomly
                     if (playerSide === 'w') {
                        setBlackFaction(Math.random() > 0.5 ? 'Undead' : 'Orc');
                     } else {
                        setWhiteFaction(Math.random() > 0.5 ? 'Human' : 'Elf');
                     }
                     startGame();
                 }} className="font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition hover:-translate-y-1 active:translate-y-0" style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1), 4px 4px 0px rgba(0,0,0,0.8)" }}>START BATTLE</button>
               </div>
             </div>
          )}`;

const startRegex = /{menuStep === 'mode' && \(/;
content = content.replace(regex, newMenuLogic);

fs.writeFileSync('src/App.tsx', content);
