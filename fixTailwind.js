import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{menuStep === 'mode' && \([\s\S]*?<\/div>\n\s*\)}/g;

const standardShadow = "shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5),inset_2px_2px_0px_rgba(255,255,255,0.1),4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5),inset_2px_2px_0px_rgba(255,255,255,0.1),6px_6px_0_rgba(0,0,0,0.8)] active:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.5),inset_2px_2px_0px_rgba(255,255,255,0.1),0px_0px_0_rgba(0,0,0,0.8)]";
const whiteSelectedShadow = "shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.5),4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.5),6px_6px_0_rgba(0,0,0,0.8)] active:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2),inset_2px_2px_0px_rgba(255,255,255,0.5),0px_0px_0_rgba(0,0,0,0.8)]";
const blackSelectedShadow = "shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),inset_2px_2px_0px_rgba(255,100,100,0.4),4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),inset_2px_2px_0px_rgba(255,100,100,0.4),6px_6px_0_rgba(0,0,0,0.8)] active:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),inset_2px_2px_0px_rgba(255,100,100,0.4),0px_0px_0_rgba(0,0,0,0.8)]";
const pveWhiteShadow = "shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3),inset_2px_2px_0px_rgba(255,255,255,1),4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3),inset_2px_2px_0px_rgba(255,255,255,1),6px_6px_0_rgba(0,0,0,0.8)] active:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3),inset_2px_2px_0px_rgba(255,255,255,1),0px_0px_0_rgba(0,0,0,0.8)]";
const pveBlackShadow = "shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.8),inset_2px_2px_0px_rgba(255,255,255,0.1),4px_4px_0_rgba(0,0,0,0.8)] hover:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.8),inset_2px_2px_0px_rgba(255,255,255,0.1),6px_6px_0_rgba(0,0,0,0.8)] active:shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.8),inset_2px_2px_0px_rgba(255,255,255,0.1),0px_0px_0_rgba(0,0,0,0.8)]";

const newMenuLogic = "{menuStep === 'mode' && (\n" +
"             <div className=\"flex flex-col gap-5 items-center animate-fade-in\">\n" +
"                <h2 className=\"text-2xl font-mono text-white mb-4 drop-shadow-md\">Select Game Mode</h2>\n" +
"                <button onClick={() => { playButtonSfx(); setGameMode('pvp'); setMenuStep('pvp-factions'); }} className={`w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>Player vs Player</button>\n" +
"                <button onClick={() => { playButtonSfx(); setGameMode('pve'); setMenuStep('pve-side'); }} className={`w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>Player vs AI</button>\n" +
"                <button onClick={() => { playButtonSfx(); setIsSettingsOpen(true); }} className={`w-64 py-4 mt-2 font-mono text-xl bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>Settings</button>\n" +
"             </div>\n" +
"          )}\n\n" +
"          {menuStep === 'pvp-factions' && (\n" +
"             <div className=\"flex flex-col gap-8 animate-fade-in\">\n" +
"               <div className=\"flex flex-col sm:flex-row gap-8 justify-center\">\n" +
"                 {/* White Faction */}\n" +
"                 <div className=\"flex-1 flex flex-col items-center gap-4\">\n" +
"                    <h2 className=\"text-xl sm:text-2xl font-mono text-white\">White Pieces</h2>\n" +
"                    <div className=\"flex flex-col gap-4 w-full\">\n" +
"                      <button onClick={() => { playButtonSfx(); setWhiteFaction('Human'); }} className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${whiteFaction === 'Human' ? 'bg-[#d4af37] border-[#d4af37] text-black " + whiteSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Humans</button>\n" +
"                      <button onClick={() => { playButtonSfx(); setWhiteFaction('Elf'); }} className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${whiteFaction === 'Elf' ? 'bg-[#d4af37] border-[#d4af37] text-black " + whiteSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Elves</button>\n" +
"                    </div>\n" +
"                 </div>\n" +
"                 {/* Black Faction */}\n" +
"                 <div className=\"flex-1 flex flex-col items-center gap-4\">\n" +
"                    <h2 className=\"text-xl sm:text-2xl font-mono text-white\">Black Pieces</h2>\n" +
"                    <div className=\"flex flex-col gap-4 w-full\">\n" +
"                      <button onClick={() => { playButtonSfx(); setBlackFaction('Undead'); }} className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${blackFaction === 'Undead' ? 'bg-[#8b2626] border-[#8b2626] text-white " + blackSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Undead</button>\n" +
"                      <button onClick={() => { playButtonSfx(); setBlackFaction('Orc'); }} className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${blackFaction === 'Orc' ? 'bg-[#8b2626] border-[#8b2626] text-white " + blackSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Orcs</button>\n" +
"                    </div>\n" +
"                 </div>\n" +
"               </div>\n" +
"               <div className=\"flex gap-6 justify-center mt-4\">\n" +
"                 <button onClick={() => { playButtonSfx(); setMenuStep('mode'); }} className={`font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>BACK</button>\n" +
"                 <button onClick={startGame} className={`font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>START BATTLE</button>\n" +
"               </div>\n" +
"             </div>\n" +
"          )}\n\n" +
"          {menuStep === 'pve-side' && (\n" +
"             <div className=\"flex flex-col gap-6 items-center animate-fade-in\">\n" +
"                <h2 className=\"text-2xl font-mono text-white mb-4 drop-shadow-md\">Choose Your Side</h2>\n" +
"                <div className=\"flex gap-6 w-full justify-center\">\n" +
"                   <button onClick={() => { playButtonSfx(); setPlayerSide('w'); setMenuStep('pve-faction'); }} className={`flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#d1c8b8] text-black border-4 border-[#fff] hover:bg-[#fff] transition hover:-translate-y-1 active:translate-y-0 " + pveWhiteShadow + "`}>WHITE TEAM</button>\n" +
"                   <button onClick={() => { playButtonSfx(); setPlayerSide('b'); setMenuStep('pve-faction'); }} className={`flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#222] text-white border-4 border-[#000] hover:bg-[#000] transition hover:-translate-y-1 active:translate-y-0 " + pveBlackShadow + "`}>BLACK TEAM</button>\n" +
"                </div>\n" +
"                <button onClick={() => { playButtonSfx(); setMenuStep('mode'); }} className={`mt-4 font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>BACK</button>\n" +
"             </div>\n" +
"          )}\n\n" +
"          {menuStep === 'pve-faction' && (\n" +
"             <div className=\"flex flex-col gap-8 animate-fade-in\">\n" +
"               <h2 className=\"text-2xl font-mono text-white\">Select Your Race</h2>\n" +
"               <div className=\"flex flex-col gap-4 w-full max-w-sm mx-auto\">\n" +
"                 {playerSide === 'w' ? (\n" +
"                   <>\n" +
"                     <button onClick={() => { playButtonSfx(); setWhiteFaction('Human'); }} className={`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${whiteFaction === 'Human' ? 'bg-[#d4af37] border-[#d4af37] text-black " + whiteSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Humans</button>\n" +
"                     <button onClick={() => { playButtonSfx(); setWhiteFaction('Elf'); }} className={`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${whiteFaction === 'Elf' ? 'bg-[#d4af37] border-[#d4af37] text-black " + whiteSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Elves</button>\n" +
"                   </>\n" +
"                 ) : (\n" +
"                   <>\n" +
"                     <button onClick={() => { playButtonSfx(); setBlackFaction('Undead'); }} className={`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${blackFaction === 'Undead' ? 'bg-[#8b2626] border-[#8b2626] text-white " + blackSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Undead</button>\n" +
"                     <button onClick={() => { playButtonSfx(); setBlackFaction('Orc'); }} className={`font-mono text-xl py-4 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${blackFaction === 'Orc' ? 'bg-[#8b2626] border-[#8b2626] text-white " + blackSelectedShadow + "' : 'bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8] " + standardShadow + "'}`}>The Orcs</button>\n" +
"                   </>\n" +
"                 )}\n" +
"               </div>\n" +
"               <div className=\"flex gap-6 justify-center mt-4\">\n" +
"                 <button onClick={() => { playButtonSfx(); setMenuStep('pve-side'); }} className={`font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>BACK</button>\n" +
"                 <button onClick={() => {\n" +
"                     if (playerSide === 'w') {\n" +
"                        setBlackFaction(Math.random() > 0.5 ? 'Undead' : 'Orc');\n" +
"                     } else {\n" +
"                        setWhiteFaction(Math.random() > 0.5 ? 'Human' : 'Elf');\n" +
"                     }\n" +
"                     startGame();\n" +
"                 }} className={`font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition hover:-translate-y-1 active:translate-y-0 " + standardShadow + "`}>START BATTLE</button>\n" +
"               </div>\n" +
"             </div>\n" +
"          )}";

if (regex.test(content)) {
    content = content.replace(regex, newMenuLogic);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Successfully fixed tailwind buttons");
} else {
    console.log("FAILED to match regex for tailwind");
}
