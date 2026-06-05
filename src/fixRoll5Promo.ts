import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldPromo = `                      let p1 = { ...piece };
                      let p2 = { ...otherPiece };
                      if (
                        p1.type === "p" &&
                        (swapSq[1] === "1" || swapSq[1] === "8")
                      )
                        p1.type = "q";
                      if (
                        p2.type === "p" &&
                        (selectedSquare[1] === "1" || selectedSquare[1] === "8")
                      )
                        p2.type = "q";`;

const newPromo = `                      let p1 = { ...piece };
                      let p2 = { ...otherPiece };`;

if (content.includes(oldPromo)) {
    content = content.replace(oldPromo, newPromo);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Fixed Roll 5 promo logic!");
} else {
    console.log("Could not find promo logic.");
}
