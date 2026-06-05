import { Chess } from "chess.js";
const g2 = new Chess("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"); // white in check by black queen
const tokens = g2.fen().split(" ");
tokens[1] = "b";
const g3 = new Chess();
g3.load(tokens.join(" "));
console.log("Moves for black:", g3.moves());
