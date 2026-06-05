import { Chess } from "chess.js";
const g = new Chess();
g.remove("e2"); // Valid board
console.log("Before load error:", g.fen());
try {
  g.load("invalid FEN string");
} catch(e: any) {
  console.log("Error caught!");
}
console.log("After load error:", g.fen());
