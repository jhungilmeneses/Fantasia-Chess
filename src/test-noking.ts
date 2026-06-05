import { Chess } from 'chess.js';

try {
  const g = new Chess();
  g.remove('e1'); // remove white king
  g.put({type: 'q', color: 'w'}, 'e1');
  console.log("Moves for e1:", g.moves({square: 'e1'}));
} catch (e: any) {
  console.log("Error:", e.message);
}
