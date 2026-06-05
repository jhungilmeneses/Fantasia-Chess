import { Chess } from "chess.js";
try {
  const g = new Chess();
  g.put({ type: "p", color: "w" }, "a1");
  console.log(g.fen());
} catch(e: any) {
  console.log("Error during put:", e.message);
}
try {
  const g2 = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/PNBQKBNR w KQkq - 0 1");
  console.log("Loaded pawn on rank 1");
} catch(e: any) {
  console.log("Error during load FEN:", e.message);
}
