import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /if \(!hasInteracted\) \{\n\s*return \(\n\s*<div \n\s*className="flex flex-col items-center justify-center min-h-screen p-4 font-sans relative cursor-pointer"\n\s*style=\{\{ backgroundColor: '#111015' \}\}\n\s*onClick=\{\(\) => \{\n\s*setHasInteracted\(true\);\n\s*playButtonSfx\(\);\n\s*if \(bgmRefMenu\.current\) bgmRefMenu\.current\.play\(\)\.catch\(\(\)=>\{\}\);\n\s*\}\}\n\s*>\n\s*<div className="bg-\[#2c241c\]/;

const replacement = `if (!hasInteracted) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen p-4 font-sans relative cursor-pointer"
        style={{ backgroundColor: '#111015' }}
        onClick={() => {
           setHasInteracted(true);
           playButtonSfx();
           if (bgmRefMenu.current) bgmRefMenu.current.play().catch(()=>{});
        }}
      >
        <audio ref={bgmRefMenu} src="/AUDIO/Kubbi%20-%20Up%20In%20My%20Jam%20%20NO%20COPYRIGHT%208-bit%20Music.mp3" loop />
        <div className="bg-[#2c241c]`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Success");
} else {
    console.log("Failed to match regex");
}
