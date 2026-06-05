import { Chess } from 'chess.js';

const g = new Chess();
// move e4
// AI move e5
// we roll 2 on g1 knight, becomes f3.
// Wait, if player rolls 2 on the piece, it becomes diceGlowPiece with turnsLeft: 2 on the new square.
// Wait! If you roll a 2, you don't automatically move!
// Roll 1: Leap forward 2 spaces
// Roll 2: Royal guard
// Roll 3: Bomb
// Roll 4: Knockback
// Roll 5: Swap
// Roll 6: Move again
