import { Chess } from "chess.js";
try {
  const g = new Chess();
  g.put({type: "q", color: "w"}, "d7");
  g.put({type: "q", color: "b"}, "d2");
  const tokens = g.fen().split(" ");
  const g2 = new Chess();
  g2.load(tokens.join(" "));
  console.log("Load successful");
} catch(e: any) {
  console.error("Load error:", e.message);
}
