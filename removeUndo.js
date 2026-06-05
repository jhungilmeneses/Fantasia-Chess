import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const strToReplace = `<button 
              onClick={() => {
                playButtonSfx();
                const newGame = new Chess(game.fen());
                newGame.undo();
                setGame(newGame);
              setSelectedSquare(null);
              setPossibleMoves([]);
            }}
            disabled={moveCount === 0}
            className="px-2 sm:px-4 py-2 sm:py-3 bg-[#4a3f35] text-[#d1c8b8] border-2 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition disabled:opacity-50"
            style={{ boxShadow: "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)" }}
          >
            UNDO
          </button>`;

if (content.includes(strToReplace)) {
    content = content.replace(strToReplace, "");
    fs.writeFileSync('src/App.tsx', content);
    console.log("Successfully removed UNDO button");
} else {
    // try to find it by regex
    const regex = /<button [\s\S]*?UNDO\n\s*<\/button>/;
    if (regex.test(content)) {
        content = content.replace(regex, "");
        fs.writeFileSync('src/App.tsx', content);
        console.log("Successfully removed UNDO button via regex!");
    } else {
        console.log("Failed to match UNDO button string");
        console.log(content.substring(content.indexOf('UNDO')-300, content.indexOf('UNDO')+100));
    }
}
