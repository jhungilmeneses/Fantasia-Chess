import { Chess } from 'chess.js';
const g = new Chess();
g.remove('e1');
console.log(g.moves({square: "d2"}));
