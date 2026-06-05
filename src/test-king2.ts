import { Chess } from "chess.js";
const g = new Chess();
g.remove("e1");
g.put({type: "q", color: "w"}, "e1");
console.log("Moves for d2 pawn:", g.moves({square: "d2"}));
