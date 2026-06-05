import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h1 className="text-4xl sm:text-5xl md:text-6xl font-mono text-\[#d4af37\] drop-shadow-\[0_4px_4px_rgba\(0,0,0,0\.8\)\]" style=\{\{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" \}\}>Fantasia Chess<\/h1>\n\s*\{menuStep === 'mode' && \(/;

const newMenuLogic = `<h1 className="text-4xl sm:text-5xl md:text-6xl font-mono text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}>Fantasia Chess</h1>
          
          {isSettingsOpen ? (
              <div className="animate-fade-in flex flex-col gap-4">
                <h2 className="text-2xl sm:text-3xl font-mono text-[#d4af37] mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}>SETTINGS</h2>
                
                <div className="flex flex-col gap-6 text-left mb-6">
                  {/* View Mode */}
                  <div>
                    <div className="text-[#d1c8b8] font-mono mb-2 text-sm">VIEW MODE</div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                            playButtonSfx();
                            if (document.fullscreenElement && document.exitFullscreen) {
                              document.exitFullscreen();
                            }
                         }}
                         className={\`flex-1 font-mono text-sm py-2 px-2 border-2 transition-colors \${!isFullscreen ? 'bg-[#5c4f42] border-[#d4af37] text-white' : 'bg-[#2c241c] border-[#3d3227] text-[#807662] hover:border-[#5c4f42]'}\`}
                       >
                         WINDOWED
                       </button>
                       <button 
                         onClick={() => {
                            playButtonSfx();
                            if (!document.fullscreenElement) {
                              document.documentElement.requestFullscreen().catch(() => {});
                            }
                         }}
                         className={\`flex-1 font-mono text-sm py-2 px-2 border-2 transition-colors \${isFullscreen ? 'bg-[#5c4f42] border-[#d4af37] text-white' : 'bg-[#2c241c] border-[#3d3227] text-[#807662] hover:border-[#5c4f42]'}\`}
                       >
                         FULL SCREEN
                       </button>
                    </div>
                  </div>

                  {/* Brightness */}
                  <div>
                    <div className="text-[#d1c8b8] font-mono mb-2 text-sm flex justify-between">
                       <span>BRIGHTNESS</span>
                       <span>{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="200" 
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Volume */}
                  <div>
                    <div className="text-[#d1c8b8] font-mono mb-2 text-sm flex justify-between">
                       <span>MASTER VOLUME</span>
                       <span>{masterVolume}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={masterVolume}
                      onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => { playButtonSfx(); setIsSettingsOpen(false); }} 
                  className="mt-4 font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg"
                  style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)" }}
                >
                  RETURN
                </button>
             </div>
          ) : (
             <>
          {menuStep === 'mode' && (`;

content = content.replace(regex, newMenuLogic);

// now find the end of the menuStep blocks to close the <>
content = content.replace(
  "startGame();\n                 }} className=\"font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition shadow-lg\">START BATTLE</button>\n               </div>\n             </div>\n          )}",
  "startGame();\n                 }} className=\"font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition shadow-lg\">START BATTLE</button>\n               </div>\n             </div>\n          )}\n          </>"
);

fs.writeFileSync('src/App.tsx', content);
