import fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');

// Updating playButtonSfx and playSfx to use Web Audio API 8bit style
const regexSfx = /const playButtonSfx \= \(\) \=\> \{\s*const audio \= new Audio\('\/AUDIO\/Button\%20SFX\.mp3'\);\s*audio\.volume \= masterVolume \/ 100;\s*audio\.play\(\)\.catch\(\(\) \=\> \{\}\);\s*\};\s*const playSfx \= \(type\: 'move' \| 'capture'\) \=\> \{[\s\S]*?\}\;/;

const newSfx = `let audioCtx: AudioContext | null = null;
  
  const initAudio = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  };

  const playButtonSfx = () => {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(masterVolume / 200, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const playSfx = (type: 'move' | 'capture') => {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    if (type === 'capture') {
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(150, audioCtx.currentTime);
       osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
       gainNode.gain.setValueAtTime(masterVolume / 150, audioCtx.currentTime);
       gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
       osc.connect(gainNode);
       gainNode.connect(audioCtx.destination);
       osc.start();
       osc.stop(audioCtx.currentTime + 0.2);
    } else {
       osc.type = 'square';
       osc.frequency.setValueAtTime(400, audioCtx.currentTime);
       osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.05);
       gainNode.gain.setValueAtTime(masterVolume / 300, audioCtx.currentTime);
       gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
       osc.connect(gainNode);
       gainNode.connect(audioCtx.destination);
       osc.start();
       osc.stop(audioCtx.currentTime + 0.1);
    }
  };`;

if (regexSfx.test(content)) {
    const res = content.replace(regexSfx, newSfx);
    fs.writeFileSync('src/App.tsx', res);
    console.log("Replaced SFX functions.");
} else {
    console.log("Could not find SFX regex.");
}
