import { Chess } from "chess.js";
const g = new Chess();
g.remove("e2"); 
try {
  g.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/PNBQKBNR w Kkq - 0 1");
} catch(e: any) {
  console.log("Error:", e.message);
}
console.log("After load error:", g.fen());
