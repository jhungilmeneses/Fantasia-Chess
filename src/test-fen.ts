import { Chess } from "chess.js";
try {
  const g = new Chess("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3");
  // Let's say w is in check.
  const checkFen = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 3 3";
  const g2 = new Chess("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"); // white in check by black queen
  console.log("Setup:", g2.fen());
  const tokens = g2.fen().split(" ");
  tokens[1] = "b";
  try {
    const g3 = new Chess();
    g3.load(tokens.join(" "));
    console.log("Loaded successfully!", g3.fen());
  } catch (e: any) {
    console.log("Load failed:", e.message);
  }
} catch (e: any) {}
