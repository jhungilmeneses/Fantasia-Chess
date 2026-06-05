import { Chess } from "chess.js";
try {
  const g = new Chess();
  g.put({type: "k", color: "w"}, "e4");
  const tokens = g.fen().split(" ");
  const g2 = new Chess();
  g2.load(tokens.join(" "));
  console.log("Load successful");
} catch(e: any) {
  console.error("Load error:", e.message);
}
