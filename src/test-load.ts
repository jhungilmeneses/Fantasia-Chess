import { Chess } from 'chess.js';
const g = new Chess();
g.remove('e2');
g.put({type: 'q', color: 'w'}, 'd7'); 
console.log("Moves:", g.moves());
