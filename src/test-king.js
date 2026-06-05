const { Chess } = require("chess.js");
try {
  const g = new Chess();
  g.remove("e1");
  g.put({type: "q", color: "w"}, "e1");
  console.log(g.moves({square: "e1"}));
} catch (e) {
  console.error("ERROR:", e.message);
}
