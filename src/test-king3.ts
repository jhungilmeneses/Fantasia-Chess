import { Chess } from "chess.js";
const g = new Chess("8/8/8/8/8/8/8/8 w - - 0 1");
g.put({type: "q", color: "w"}, "e1");
console.log("Moves for q on e1:", g.moves({square: "e1"}));
