import { Chess } from "chess.js";
try {
  const g = new Chess();
  // King makes a queen move, leaves himself in check from a bishop or something
  // or puts himself directly into check
  const g2 = new Chess("rnbqkbnr/pppp1ppp/8/8/4p3/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"); 
  g2.remove("e1");
  g2.put({type: "k", color: "w"}, "e3"); // moving king into pawn attack
  const tokens = g2.fen().split(" ");
  tokens[1] = "b"; // flip turn
  const g3 = new Chess();
  g3.load(tokens.join(" "));
  console.log("Load successful for IronWill king move!");
} catch(e: any) {
  console.log("Error:", e.message);
}
