import { Chess } from 'chess.js';

let newGame = new Chess();
let moveResult = newGame.move({from: "e2", to: "e4"});
console.log(moveResult);
