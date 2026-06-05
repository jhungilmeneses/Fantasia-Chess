/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Chess, Square, Move } from "chess.js";
import { motion, AnimatePresence } from "motion/react";

const PIECES: Record<string, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
};

type FactionWhite = "Human" | "Elf";
type FactionBlack = "Undead" | "Orc";

const getPieceImages = (
  whiteFaction: FactionWhite,
  blackFaction: FactionBlack,
): Record<string, string> => ({
  // White Pieces
  w_p:
    whiteFaction === "Human"
      ? "/HUMAN_CHESS_PIECES/HUMAN_PAWN-removebg-preview.png"
      : "/ELF_CHESS_PIECES/ELF_PAWN-removebg-preview.png",
  w_n:
    whiteFaction === "Human"
      ? "/HUMAN_CHESS_PIECES/HUMAN_KNIGHT-removebg-preview.png"
      : "/ELF_CHESS_PIECES/ELF_KNIGHT-removebg-preview.png",
  w_b:
    whiteFaction === "Human"
      ? "/HUMAN_CHESS_PIECES/HUMAN_BISHOP-removebg-preview.png"
      : "/ELF_CHESS_PIECES/ELF_BISHOP-removebg-preview.png",
  w_r:
    whiteFaction === "Human"
      ? "/HUMAN_CHESS_PIECES/HUMAN_ROOK-removebg-preview.png"
      : "/ELF_CHESS_PIECES/ELF_ROOK-removebg-preview.png",
  w_q:
    whiteFaction === "Human"
      ? "/HUMAN_CHESS_PIECES/HUMAN_QUEEN-removebg-preview.png"
      : "/ELF_CHESS_PIECES/ELF_QUEEN-removebg-preview.png",
  w_k:
    whiteFaction === "Human"
      ? "/HUMAN_CHESS_PIECES/HUMAN_KING-removebg-preview.png"
      : "/ELF_CHESS_PIECES/ELF_KING-removebg-preview.png",

  // Black Pieces
  b_p:
    blackFaction === "Undead"
      ? "/UNDEAD_CHESS_PIECES/SKELETAL_PAWN-removebg-preview.png"
      : "/ORC_CHESS_PIECES/ORC_PAWN-removebg-preview.png",
  b_n:
    blackFaction === "Undead"
      ? "/UNDEAD_CHESS_PIECES/SKELETAL_KNIGHT-removebg-preview.png"
      : "/ORC_CHESS_PIECES/ORC_RIDER-removebg-preview.png",
  b_b:
    blackFaction === "Undead"
      ? "/UNDEAD_CHESS_PIECES/SKELETAL_BISHOP-removebg-preview.png"
      : "/ORC_CHESS_PIECES/ORC_BISHOP-removebg-preview.png",
  b_r:
    blackFaction === "Undead"
      ? "/UNDEAD_CHESS_PIECES/SKELETAL_ROOK-removebg-preview.png"
      : "/ORC_CHESS_PIECES/ORC_ROOK-removebg-preview.png",
  b_q:
    blackFaction === "Undead"
      ? "/UNDEAD_CHESS_PIECES/SKELETAL_DRAGON-removebg-preview.png"
      : "/ORC_CHESS_PIECES/ORC_SHAMAN-removebg-preview.png",
  b_k:
    blackFaction === "Undead"
      ? "/UNDEAD_CHESS_PIECES/SKELETAL_KING-removebg-preview.png"
      : "/ORC_CHESS_PIECES/ORC_WARLORD-removebg-preview.png",
});

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 8,
  k: 0,
};

export default function App() {
  const INITIAL_TIME = 10 * 60; // 10 minutes in seconds

  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [whiteTime, setWhiteTime] = useState(INITIAL_TIME);
  const [blackTime, setBlackTime] = useState(INITIAL_TIME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAbilitiesGuideOpen, setIsAbilitiesGuideOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [masterVolume, setMasterVolume] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const bgmRefMenu = useRef<HTMLAudioElement>(null);
  const bgmRefGame = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (bgmRefMenu.current) bgmRefMenu.current.volume = masterVolume / 100;
    if (bgmRefGame.current) bgmRefGame.current.volume = masterVolume / 100;
  }, [masterVolume]);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [menuStep, setMenuStep] = useState<
    "mode" | "pvp-factions" | "pve-side" | "pve-faction"
  >("mode");
  const [gameMode, setGameMode] = useState<"pvp" | "pve" | null>(null);
  const [playerSide, setPlayerSide] = useState<"w" | "b">("w");
  const [aiMoveQueued, setAiMoveQueued] = useState<
    import("chess.js").Move | null
  >(null);

  const [gameStarted, setGameStarted] = useState(false);

  const [whiteFaction, setWhiteFaction] = useState<FactionWhite>("Human");
  const [blackFaction, setBlackFaction] = useState<FactionBlack>("Undead");
  const [whitePoints, setWhitePoints] = useState(0);
  const [blackPoints, setBlackPoints] = useState(0);
  const [pendingPromotion, setPendingPromotion] = useState<{
    moves: Move[];
    square: Square;
  } | null>(null);
  const [eventTiles, setEventTiles] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<{
    square: string;
    type: string;
    dice?: number;
  } | null>(null);

  // Event modifiers state
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [lavaTiles, setLavaTiles] = useState<
    { square: string; turnsLeft: number }[]
  >([]);
  const [floodedTiles, setFloodedTiles] = useState<
    { square: string; turnsLeft: number }[]
  >([]);
  const [chaosMode, setChaosMode] = useState<{
    active: boolean;
    turnsLeft: number;
  } | null>(null);
  const [chaosWinner, setChaosWinner] = useState<string | null>(null);
  const [eventWinner, setEventWinner] = useState<string | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [customHistory, setCustomHistory] = useState<any[]>([]);
  const [animMove, setAnimMove] = useState<{
    fromCol: number;
    fromRow: number;
    toCol: number;
    toRow: number;
    color: string;
    piece: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    if (customHistory.length > 0) {
      const lastMove = customHistory[customHistory.length - 1];
      if (lastMove && lastMove.from && lastMove.to) {
        const fromCol = lastMove.from.charCodeAt(0) - 97;
        const fromRow = 8 - parseInt(lastMove.from[1]);
        const toCol = lastMove.to.charCodeAt(0) - 97;
        const toRow = 8 - parseInt(lastMove.to[1]);
        
        setAnimMove({
          fromCol,
          fromRow,
          toCol,
          toRow,
          color: lastMove.color,
          piece: lastMove.piece,
          id: Date.now(),
        });
      }
    } else {
      setAnimMove(null);
    }
  }, [customHistory]);
  const [whiteDiceRolls, setWhiteDiceRolls] = useState(0);
  const [blackDiceRolls, setBlackDiceRolls] = useState(0);
  const [diceRollResult, setDiceRollResult] = useState<{
    player: "w" | "b";
    dice: number;
    msg: string;
  } | null>(null);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [rollingDiceValue, setRollingDiceValue] = useState(1);
  const [queenLastMoveW, setQueenLastMoveW] = useState<{
    from: string;
    to: string;
    captured: boolean;
  } | null>(null);
  const [queenLastMoveB, setQueenLastMoveB] = useState<{
    from: string;
    to: string;
    captured: boolean;
  } | null>(null);
  const [holyLightPiece, setHolyLightPiece] = useState<{
    square: string;
    turnsLeft: number;
    color: string;
  } | null>(null);
  const [pendingHolyLight, setPendingHolyLight] = useState<string | null>(null); // Bishop square
  const [activeKnightMomentum, setActiveKnightMomentum] = useState<
    string | null
  >(null); // Knight square
  const [pendingMomentumJump, setPendingMomentumJump] = useState<{
    square: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    if (!gameStarted && hasInteracted && bgmRefMenu.current) {
      bgmRefMenu.current.play().catch(() => {});
    }
  }, [hasInteracted, gameStarted]);
  const [ironWill, setIronWill] = useState<{
    color: string;
    turnsLeft: number;
    capturesMade: number;
  } | null>(null);
    const [royalPanic, setRoyalPanic] = useState<{ color: string; turnsLeft: number } | null>(null);
  const [skillUses, setSkillUses] = useState<{
    w: { q: number; r: number; b: number; n: number; k: number };
    b: { q: number; r: number; b: number; n: number; k: number };
  }>({
    w: { q: 0, r: 0, b: 0, n: 0, k: 0 },
    b: { q: 0, r: 0, b: 0, n: 0, k: 0 },
  });

  let audioCtx: AudioContext | any = null;
  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  };

  const playButtonSfx = () => {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      800,
      audioCtx.currentTime + 0.05,
    );
    gainNode.gain.setValueAtTime(masterVolume / 200, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.1,
    );
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const playCaptureSfx = () => {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
    gainNode.gain.setValueAtTime(masterVolume / 150, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.2,
    );
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  };

  const playMoveSfx = () => {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(masterVolume / 300, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.1,
    );
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const [diceGlowPiece, setDiceGlowPiece] = useState<{
    square: string;
    turnsLeft: number;
    color: string;
  } | null>(null);

  const [captureAnim, setCaptureAnim] = useState<{
    square: string;
    id: number;
  } | null>(null);

  const EVENT_TYPES = [
    ...Array(5).fill("Necromancer Circle"),
    ...Array(5).fill("Holy Sanctuary"),
    ...Array(5).fill("Lava Crack"),
    ...Array(5).fill("Flooded Tiles"),
    ...Array(5).fill("Portal Rift"),
    ...Array(2).fill("Ancient Dragon"),
    ...Array(3).fill("Final Eclipse"),
  ];

  const DICE_EFFECTS: Record<number, { name: string; desc: string }> = {
    1: {
      name: "Leap Forward",
      desc: "The selected piece moves forward 2 spaces, ignoring pieces in the way.",
    },
    2: {
      name: "Royal Guard",
      desc: "One chosen piece becomes protected and cannot be captured on the next enemy turn.",
    },
    3: {
      name: "Swift Advance",
      desc: "The activated piece may move one extra tile immediately.",
    },
    4: {
      name: "Misstep",
      desc: "The selected piece becomes disoriented and must move one tile backward if possible.",
    },
    5: {
      name: "Position Shift",
      desc: "The selected piece may swap places with a nearby allied piece.",
    },
    6: {
      name: "Royal Panic",
      desc: "All allied pieces within nearby tiles lose their special abilities for 1 turn.",
    },
  };

  const getEmptySquares = (tempGame: Chess) => {
    const squares: Square[] = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let r = 1; r <= 8; r++) {
      for (const f of files) {
        if (!tempGame.get((f + r) as Square)) squares.push((f + r) as Square);
      }
    }
    return squares;
  };

  const getPossibleMoves = (tempGame: Chess, square: Square) => {
    const piece = tempGame.get(square);
    if (!piece) return [];

    if (
      floodedTiles.some((f) => f.square === square) ||
      lavaTiles.some((l) => l.square === square)
    ) {
      return [];
    }

    let moves = tempGame.moves({
      square,
      verbose: true,
    }) as import("chess.js").Move[];

    moves = moves.filter(
      (m) =>
        !floodedTiles.some((f) => f.square === m.to) &&
        !lavaTiles.some((l) => l.square === m.to) &&
        !(
          diceGlowPiece &&
          diceGlowPiece.color !== piece.color &&
          m.to === diceGlowPiece.square
        ),
    );

    if (ironWill?.color === piece.color && piece.type === "k") {
      if (ironWill.capturesMade >= 3) {
        moves = moves.filter((m) => !m.captured);
      }
      const proxyGame = new Chess(tempGame.fen());
      proxyGame.remove(square);

      ["q", "n"].forEach((proxyType) => {
        proxyGame.put({ type: proxyType as any, color: piece.color }, square);
        const proxyMoves = proxyGame.moves({
          square,
          verbose: true,
        }) as import("chess.js").Move[];
        proxyMoves.forEach((m) => {
          if (
            floodedTiles.some((f) => f.square === m.to) ||
            lavaTiles.some((l) => l.square === m.to) ||
            (diceGlowPiece &&
              diceGlowPiece.color !== piece.color &&
              m.to === diceGlowPiece.square)
          )
            return;
          if (ironWill.capturesMade >= 3 && m.captured) return;
          
          if (!moves.some((existing) => existing.to === m.to)) {
            // Clone the move object but set piece to 'k' so it formats properly in UI
            moves.push({ ...m, piece: "k" } as any);
          }
        });
        proxyGame.remove(square);
      });
    }

    if (holyLightPiece) {
      moves = moves.filter(
        (m) => !(m.captured && m.to === holyLightPiece.square),
      );
    }

    return moves;
  };

  const generateEventTiles = () => {
    const numTiles = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6
    const tiles: string[] = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["3", "4", "5", "6"];
    while (tiles.length < numTiles) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
      const square = `${randomFile}${randomRank}`;
      if (!tiles.includes(square)) {
        tiles.push(square);
      }
    }
    return tiles;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const isGameEnded =
      checkIsGameOver() ||
      chaosWinner !== null ||
      eventWinner !== null ||
      (ironWill !== null && ironWill.turnsLeft === 0);
    if (
      !gameStarted ||
      isGameEnded ||
      isMenuOpen ||
      moveCount === 0 ||
      pendingPromotion ||
      activeEvent
    )
      return;

    const interval = setInterval(() => {
      if (game.turn() === "w") {
        setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    game,
    isMenuOpen,
    gameStarted,
    chaosWinner,
    eventWinner,
    moveCount,
    pendingPromotion,
    activeEvent,
  ]);

  useEffect(() => {
    let whiteKingAlive = false;
    let blackKingAlive = false;
    let whitePiecesCount = 0;
    let blackPiecesCount = 0;

    game.board().forEach((row) =>
      row.forEach((p) => {
        if (p) {
          if (p.color === "w") {
            whitePiecesCount++;
            if (p.type === "k") whiteKingAlive = true;
          } else {
            blackPiecesCount++;
            if (p.type === "k") blackKingAlive = true;
          }
        }
      }),
    );

    if (!whiteKingAlive || !blackKingAlive) {
      if (whiteKingAlive && !blackKingAlive)
        setEventWinner(whiteFaction.toUpperCase());
      else if (blackKingAlive && !whiteKingAlive)
        setEventWinner(blackFaction.toUpperCase());
      else setEventWinner("TIE");
    } else {
      setEventWinner(null);
    }

    if (
      whitePiecesCount === 1 &&
      whiteKingAlive &&
      skillUses.w.k === 0 &&
      (!ironWill || ironWill.color !== "w")
    ) {
      setIronWill({ color: "w", turnsLeft: 15, capturesMade: 0 });
      setSkillUses((prev) => ({ ...prev, w: { ...prev.w, k: 1 } }));
    }
    if (
      blackPiecesCount === 1 &&
      blackKingAlive &&
      skillUses.b.k === 0 &&
      (!ironWill || ironWill.color !== "b")
    ) {
      setIronWill({ color: "b", turnsLeft: 15, capturesMade: 0 });
      setSkillUses((prev) => ({ ...prev, b: { ...prev.b, k: 1 } }));
    }
  }, [game, whiteFaction, blackFaction, skillUses, ironWill]);


  const executeDiceOfFate = (roll: number, playerColor: "w" | "b", targetSquare: import("chess.js").Square) => {
    let actualMsg = DICE_EFFECTS[roll]?.desc || "";
    const newGame = new Chess(game.fen());
    let finalSquare = targetSquare;
    const piece = newGame.get(targetSquare);
    if (!piece) return { newGame, actualMsg, finalSquare };

    const handleLava = (sq: string, pType: string) => {
      if (lavaTiles.some(t => t.square === sq)) {
        newGame.remove(sq as import("chess.js").Square);
        if (playerColor === 'w') setCapturedWhite(prev => [...prev, pType]);
        else setCapturedBlack(prev => [...prev, pType]);
        return true; // died
      }
      return false; 
    };

    if (roll === 1 || roll === 3 || roll === 4) {
      const fileStr = targetSquare[0];
      const rank = parseInt(targetSquare[1]);
      let dir = playerColor === "w" ? 1 : -1;
      if (roll === 4) dir = -dir; // misstep backwards
      let steps = roll === 1 ? 2 : 1;
      const newRank = rank + dir * steps;

      if (newRank >= 1 && newRank <= 8) {
        const targetSq = `${fileStr}${newRank}` as import("chess.js").Square;
        const targetPiece = newGame.get(targetSq);
        
        let canMove = false;
        if (roll === 1) {
          canMove = !targetPiece || (targetPiece.color !== playerColor && targetPiece.type !== "k");
        } else {
          canMove = !targetPiece;
        }

        if (canMove) {
          newGame.remove(targetSquare);
          let movedPiece = { ...piece };
          if (movedPiece.type === "p" && (newRank === 1 || newRank === 8)) movedPiece.type = "q";
          newGame.put(movedPiece, targetSq);
          finalSquare = targetSq;

          if (targetPiece && roll === 1) {
            if (playerColor === "w") setCapturedBlack(prev => [...prev, targetPiece.type]);
            else setCapturedWhite(prev => [...prev, targetPiece.type]);
          }

          handleLava(targetSq, movedPiece.type);
        } else {
          actualMsg += " (Failed: Blocked)";
        }
      } else {
        actualMsg += " (Failed: Edge of board)";
      }
    } else if (roll === 5) {
      const board = newGame.board();
      const allies: string[] = [];
      const fileIdx = targetSquare.charCodeAt(0);
      const rank = parseInt(targetSquare[1]);
      
      board.forEach((r, ri) => r.forEach((p, fi) => {
        if (p && p.color === playerColor) {
          const sq = `${String.fromCharCode(97 + fi)}${8 - ri}`;
          if (sq !== targetSquare) {
            const pFile = sq.charCodeAt(0);
            const pRank = parseInt(sq[1]);
            const isSelectedPawn = piece.type === 'p';
            const isTargetPawn = p.type === 'p';
            let canSwap = true;
            if (isSelectedPawn && (pRank === 1 || pRank === 8)) canSwap = false;
            if (isTargetPawn && (rank === 1 || rank === 8)) canSwap = false;

            if (canSwap && Math.max(Math.abs(pFile - fileIdx), Math.abs(pRank - rank)) <= 2) {
              allies.push(sq);
            }
          }
        }
      }));

      if (allies.length > 0) {
        const swapSqStr = allies[Math.floor(Math.random() * allies.length)];
        const swapSq = swapSqStr as import("chess.js").Square;
        const otherPiece = newGame.get(swapSq);
        newGame.remove(targetSquare);
        newGame.remove(swapSq);
        let p1 = { ...piece };
        let p2 = { ...otherPiece };
        newGame.put(p2, targetSquare);
        newGame.put(p1, swapSq);

        handleLava(swapSq, p1.type);
        handleLava(targetSquare, p2.type);

        finalSquare = swapSq;
        actualMsg += ` (Swapped with ${swapSq})`;
      } else {
        actualMsg += " (Failed: No nearby allies)";
      }
    } else if (roll === 6) {
      setRoyalPanic({ color: playerColor, turnsLeft: 2 });
    }
    
    return { newGame, actualMsg, finalSquare };
  };
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleImageError = (pieceKey: string) => {
    if (!imageErrors[pieceKey]) {
      setImageErrors((prev) => ({ ...prev, [pieceKey]: true }));
    }
  };

  const handlePromotion = (promotionPiece: string, cost: number) => {
    if (!pendingPromotion) return;

    const move = pendingPromotion.moves.find(
      (m) => m.promotion === promotionPiece,
    );
    if (move) {
      const newGame = new Chess(game.fen());
      try {
        let moveParams: any = { from: move.from, to: move.to };
        if (move.promotion) moveParams.promotion = move.promotion;
        const moveResult = newGame.move(moveParams);
        setCustomHistory((prev) => [...prev, moveResult]);
        setTimeout(() => {
          if (moveResult.captured) playCaptureSfx();
          else playMoveSfx();
        }, 250);
        // Add the points of the captured piece if there is one
        const capturedPoints = moveResult.captured
          ? PIECE_VALUES[moveResult.captured] || 0
          : 0;

        if (moveResult.captured && moveResult.color === "w")
          setCapturedBlack((prev) => [...prev, moveResult.captured!]);
        else if (moveResult.captured && moveResult.color === "b")
          setCapturedWhite((prev) => [...prev, moveResult.captured!]);

        // At this point, game.turn() represents the team that initiated the promotion move
        if (game.turn() === "w") {
          setWhitePoints((prev) => prev - cost + capturedPoints);
        } else {
          setBlackPoints((prev) => prev - cost + capturedPoints);
        }

        if (holyLightPiece && holyLightPiece.color !== moveResult.color) {
          setHolyLightPiece((prev) =>
            prev && prev.turnsLeft > 1
              ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
              : null,
          );
        } else if (
          holyLightPiece &&
          holyLightPiece.color === moveResult.color &&
          holyLightPiece.turnsLeft <= 1
        ) {
          setHolyLightPiece(null);
        }

        if (ironWill) {
          setIronWill((prev) =>
            prev && prev.turnsLeft > 1
              ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
              : prev
                ? null
                : null,
          );
        }

        // Handle dice glow turns
        if (diceGlowPiece) {
          setDiceGlowPiece((prev) => {
            if (!prev || prev.turnsLeft <= 1) return null;
            let nextSquare = prev.square;
            if (prev.square === move.from) nextSquare = move.to;
            else if (prev.square === move.to) return null; // Captured
            return {
              ...prev,
              turnsLeft: prev.turnsLeft - 1,
              square: nextSquare,
            };
          });
        }

        // Decrease modifier turns
        setLavaTiles((prev) =>
          prev
            .map((l) => ({ ...l, turnsLeft: l.turnsLeft - 1 }))
            .filter((l) => l.turnsLeft > 0),
        );
        setFloodedTiles((prev) =>
          prev
            .map((f) => ({ ...f, turnsLeft: f.turnsLeft - 1 }))
            .filter((f) => f.turnsLeft > 0),
        );

        if (chaosMode && chaosMode.active) {
          const nextTurns = chaosMode.turnsLeft - 1;
          if (nextTurns <= 0) {
            let wCount = 0;
            let bCount = 0;
            newGame.board().forEach((r) =>
              r.forEach((p) => {
                if (p) {
                  if (p.color === "w") wCount++;
                  else bCount++;
                }
              }),
            );
            if (wCount > bCount) setChaosWinner(whiteFaction.toUpperCase());
            else if (bCount > wCount)
              setChaosWinner(blackFaction.toUpperCase());
            else setChaosWinner("TIE");
          } else {
            setChaosMode({ active: true, turnsLeft: nextTurns });
          }
        }

        // Lava Capture
        if (lavaTiles.some((l) => l.square === move.to)) {
          newGame.remove(move.to as Square);
          setDiceGlowPiece((prev) =>
            prev && (prev.square === move.from || prev.square === move.to)
              ? null
              : prev,
          );
          if (moveResult.color === "w")
            setCapturedWhite((prev) => [...prev, moveResult.piece]);
          else setCapturedBlack((prev) => [...prev, moveResult.piece]);
        }

        let newEventTiles = [...eventTiles];

        if (eventTiles.includes(move.to)) {
          newEventTiles = newEventTiles.filter((t) => t !== move.to);
          const type =
            EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
          setActiveEvent({ square: move.to, type });
        }

        const newMoveCount = moveCount + 1;
        setMoveCount(newMoveCount);

        if (newMoveCount > 0 && newMoveCount % 4 === 0) {
          const emptySquares = getEmptySquares(newGame);
          const possibleTiles = emptySquares.filter(
            (s) => !newEventTiles.includes(s),
          );
          if (possibleTiles.length > 0) {
            const randomSquare =
              possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
            newEventTiles.push(randomSquare);
          }
        }

        setEventTiles(newEventTiles);

        setGame(newGame);
      } catch (e) {
        console.error("Invalid move", e);
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
      setPendingPromotion(null);
    }
  };

  // Function to handle event resolution
  const handleEventContinue = () => {
    if (!activeEvent) return;
    const newGame = new Chess(game.fen());
    const emptySquares = getEmptySquares(newGame);
    const piece = newGame.get(activeEvent.square as Square);
    const triggerColor = piece ? piece.color : game.turn() === "w" ? "b" : "w";

    
    let eventFinished = true;

    if (ironWill && ironWill.capturesMade >= 3) {
      if (ironWill.color === "w") setEventWinner(whiteFaction.toUpperCase());
      else setEventWinner(blackFaction.toUpperCase());
    }


    if (activeEvent.type === "Necromancer Circle") {
      const enemyCaptured =
        triggerColor === "w" ? capturedBlack : capturedWhite;
      if (enemyCaptured.length > 0 && emptySquares.length > 0) {
        const sq =
          emptySquares[Math.floor(Math.random() * emptySquares.length)];
        let pType = enemyCaptured[0] as any;
        if (pType === "p" && (sq[1] === "1" || sq[1] === "8")) pType = "q";
        newGame.put(
          {
            type: pType,
            color: triggerColor === "w" ? "b" : "w",
          },
          sq,
        );
        if (triggerColor === "w") setCapturedBlack(enemyCaptured.slice(1));
        else setCapturedWhite(enemyCaptured.slice(1));
      }
    } else if (activeEvent.type === "Holy Sanctuary") {
      const allyCaptured = triggerColor === "w" ? capturedWhite : capturedBlack;
      const numToRevive = Math.min(allyCaptured.length, 3, emptySquares.length);
      for (let i = 0; i < numToRevive; i++) {
        const sq = emptySquares.splice(
          Math.floor(Math.random() * emptySquares.length),
          1,
        )[0];
        let pType = allyCaptured[i] as any;
        if (pType === "p" && (sq[1] === "1" || sq[1] === "8")) pType = "q";
        newGame.put({ type: pType, color: triggerColor as any }, sq);
      }
      if (triggerColor === "w")
        setCapturedWhite(allyCaptured.slice(numToRevive));
      else setCapturedBlack(allyCaptured.slice(numToRevive));
    } else if (activeEvent.type === "Lava Crack") {
      if (piece && piece.type !== "k") {
        newGame.remove(activeEvent.square as Square);
        if (piece.color === "w")
          setCapturedWhite((prev) => [...prev, piece.type]);
        else setCapturedBlack((prev) => [...prev, piece.type]);
        playCaptureSfx();
        setTimeout(() => {
          setCaptureAnim({ square: activeEvent.square, id: Date.now() });
          setTimeout(() => setCaptureAnim(null), 600);
        }, 250);
      }
      setLavaTiles((prev) => [
        ...prev,
        { square: activeEvent.square, turnsLeft: 6 },
      ]);
    } else if (activeEvent.type === "Flooded Tiles") {
      setFloodedTiles((prev) => [
        ...prev,
        { square: activeEvent.square, turnsLeft: 4 },
      ]);
    } else if (activeEvent.type === "Portal Rift") {
      if (piece && piece.type !== "k" && emptySquares.length > 0) {
        newGame.remove(activeEvent.square as Square);
        const sq =
          emptySquares[Math.floor(Math.random() * emptySquares.length)];
        if (piece.type === "p" && (sq[1] === "1" || sq[1] === "8"))
          piece.type = "q";
        newGame.put(piece, sq);
      }
    } else if (activeEvent.type === "Final Eclipse") {
      setWhiteTime(60);
      setBlackTime(60);
      setChaosMode({ active: true, turnsLeft: 10 });
    } else if (activeEvent.type === "Ancient Dragon") {
      const files = "abcdefgh";
      const fileIdx = Math.floor(Math.random() * 7);
      const rank = Math.floor(Math.random() * 7) + 1;
      for (let dx = 0; dx <= 1; dx++) {
        for (let dy = 0; dy <= 1; dy++) {
          const sq = `${files[fileIdx + dx]}${rank + dy}` as Square;
          const p = newGame.get(sq);
          if (p && p.type !== "k") {
            newGame.remove(sq);
            if (p.color === "w") setCapturedWhite((prev) => [...prev, p.type]);
            else setCapturedBlack((prev) => [...prev, p.type]);
          }
        }
      }

      const currentTurn = newGame.turn();
      const otherTurn = currentTurn === "w" ? "b" : "w";

      let otherInCheck = false;
      const tokensOther = newGame.fen().split(" ");
      tokensOther[1] = otherTurn;
      tokensOther[3] = "-";
      try {
        const testGame = new Chess(tokensOther.join(" "));
        otherInCheck = testGame.isCheck();
      } catch (e) {}

      let currentInCheck = false;
      const tokensCurrent = newGame.fen().split(" ");
      tokensCurrent[3] = "-";
      try {
        const testGame = new Chess(tokensCurrent.join(" "));
        currentInCheck = testGame.isCheck();
      } catch (e) {}

      if (otherInCheck && !currentInCheck) {
        try {
          newGame.load(tokensOther.join(" "));
        } catch (e) {}
      }
    }

    setGame(newGame);
    setActiveEvent(null);
  };

  const checkIsGameOver = () => {
    if (capturedWhite.includes("k") || capturedBlack.includes("k")) return true;
    
    let isOver = game.isGameOver();
    if (isOver && ironWill && ironWill.color === game.turn()) {
      let hasMoves = false;
      game.board().forEach((r, ri) =>
        r.forEach((p, fi) => {
          if (p && p.color === game.turn()) {
            const sq = (String.fromCharCode(97 + fi) +
              (8 - ri)) as import("chess.js").Square;
            if (getPossibleMoves(game, sq).length > 0) hasMoves = true;
          }
        }),
      );
      if (hasMoves) return false;
    }
    return isOver;
  };

  const checkIsCheckmate = () => {
    return checkIsGameOver() && game.isCheck();
  };
  const onSquareClick = (square: Square) => {
    // If game over, paused, or time is out, do nothing
    if (
      checkIsGameOver() ||
      isMenuOpen ||
      whiteTime === 0 ||
      blackTime === 0 ||
      pendingPromotion ||
      activeEvent ||
      (ironWill !== null && ironWill.turnsLeft === 0)
    ) {
      return;
    }

    const piece = game.get(square);

    if (pendingHolyLight) {
      if (piece && piece.color === game.turn() && piece.type !== "k") {
        setHolyLightPiece({ square, turnsLeft: 2, color: piece.color });
        const newGame = new Chess(game.fen());
        const tokens = newGame.fen().split(" ");
        tokens[1] = tokens[1] === "w" ? "b" : "w";
        tokens[3] = "-";
        newGame.load(tokens.join(" "));
        setGame(newGame);
      }
      setPendingHolyLight(null);
      return;
    }

    if (pendingMomentumJump) {
      const knightSquare = pendingMomentumJump.square;
      const knFile = knightSquare.charCodeAt(0);
      const knRank = parseInt(knightSquare[1]);
      const sqFile = square.charCodeAt(0);
      const sqRank = parseInt(square[1]);

      const isAdjacent =
        Math.max(Math.abs(knFile - sqFile), Math.abs(knRank - sqRank)) === 1;

      if (isAdjacent && !game.get(square) && !lavaTiles.some(t => t.square === square) && !floodedTiles.some(t => t.square === square)) {
        const newGame = new Chess(game.fen());
        const knightPiece = newGame.get(knightSquare as Square);
        newGame.remove(knightSquare as Square);
        newGame.put(knightPiece, square);
        setCustomHistory((prev) => [
          ...prev,
          {
            color: knightPiece.color,
            piece: "n",
            from: knightSquare,
            to: square,
            captured: false,
          },
        ]);
        if (diceGlowPiece && diceGlowPiece.square === knightSquare) {
          setDiceGlowPiece((prev) =>
            prev ? { ...prev, square: square } : null,
          );
        }
        setGame(newGame);
      }
      setPendingMomentumJump(null);
      return;
    }

    // If nothing selected
    if (!selectedSquare) {
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(getPossibleMoves(game, square));
      }
      return;
    }

    // If already selected, check if clicked square is a possible move
    const movesForSquare = possibleMoves.filter((m) => m.to === square);

    if (movesForSquare.length > 0) {
      if (floodedTiles.some((f) => f.square === square)) {
        return; // Block movement to flooded tiles
      }

      const isPromotion = movesForSquare.some((m) => m.promotion);
      if (isPromotion) {
        setPendingPromotion({ moves: movesForSquare, square });
        return;
      }

      const move = movesForSquare[0];

      const newGame = new Chess(game.fen());
      try {
        let moveResult;
        try {
          let moveParams: any = { from: move.from, to: move.to };
          if (move.promotion) moveParams.promotion = move.promotion;
          moveResult = newGame.move(moveParams);
        } catch (e) {}

        if (!moveResult) {
          const capTarget = newGame.get(move.to as import("chess.js").Square);
          const p = newGame.get(move.from as import("chess.js").Square);
          const pType: any = p ? p.type : (move.piece || "k");
          moveResult = {
            color: game.turn(),
            from: move.from,
            to: move.to,
            piece: pType,
            captured: capTarget ? capTarget.type : undefined,
          };
          newGame.remove(move.from as import("chess.js").Square);
          newGame.put(
            { type: pType, color: game.turn() },
            move.to as import("chess.js").Square,
          );
          const tokens = newGame.fen().split(" ");
          tokens[1] = tokens[1] === "w" ? "b" : "w";
          tokens[2] = "-";
          tokens[3] = "-";
          try {
            newGame.load(tokens.join(" "));
          } catch (e) {}

          setTimeout(() => {
            if (moveResult.captured) playCaptureSfx();
            else playMoveSfx();
          }, 250);
        } else {
          setTimeout(() => {
            if (moveResult.captured) playCaptureSfx();
            else playMoveSfx();
          }, 250);
        }

        setCustomHistory((prev) => [...prev, moveResult]);

        if (moveResult && moveResult.captured) {
          if (
            ironWill &&
            ironWill.color === moveResult.color &&
            moveResult.piece === "k"
          ) {
            setIronWill((prev) =>
              prev ? { ...prev, capturesMade: prev.capturesMade + 1 } : null,
            );
          }

          setTimeout(() => {
            setCaptureAnim({ square: moveResult.to, id: Date.now() });
            setTimeout(() => setCaptureAnim(null), 600);
          }, 250);

          if (moveResult.color === "w")
            setCapturedBlack((prev) => [...prev, moveResult.captured!]);
          else setCapturedWhite((prev) => [...prev, moveResult.captured!]);

          const points = PIECE_VALUES[moveResult.captured] || 0;
          if (game.turn() === "w") {
            setWhitePoints((prev) => prev + points);
          } else {
            setBlackPoints((prev) => prev + points);
          }
        }

        // Track Queen Moves
        if (moveResult && moveResult.piece === "q") {
          if (moveResult.color === "w") {
            setQueenLastMoveW({
              from: moveResult.from,
              to: moveResult.to,
              captured: !!moveResult.captured,
            });
          } else {
            setQueenLastMoveB({
              from: moveResult.from,
              to: moveResult.to,
              captured: !!moveResult.captured,
            });
          }
        }

        // Handle Holy Light turn decrement
        if (holyLightPiece && holyLightPiece.color !== moveResult.color) {
          setHolyLightPiece((prev) =>
            prev && prev.turnsLeft > 1
              ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
              : null,
          );
        } else if (
          holyLightPiece &&
          holyLightPiece.color === moveResult.color &&
          holyLightPiece.turnsLeft <= 1
        ) {
          setHolyLightPiece(null);
        }

        // Handle activeKnightMomentum
        if (
          moveResult &&
          moveResult.piece === "n" &&
          activeKnightMomentum === moveResult.from
        ) {
          setPendingMomentumJump({
            square: moveResult.to,
            color: moveResult.color,
          });
          setActiveKnightMomentum(null);
        }

        // Handle Royal Panic turns
        if (royalPanic) {
          setRoyalPanic((prev) =>
            prev && prev.turnsLeft > 1
              ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
              : prev
                ? null
                : null,
          );
        }
        
        // Handle Iron Will turns
        if (ironWill) {
          setIronWill((prev) =>
            prev && prev.turnsLeft > 1
              ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
              : prev
                ? null
                : null,
          );
        }

        // Handle dice glow turns
        if (diceGlowPiece) {
          setDiceGlowPiece((prev) => {
            if (!prev || prev.turnsLeft <= 1) return null;
            let nextSquare = prev.square;
            if (prev.square === move.from) nextSquare = move.to;
            else if (prev.square === move.to) return null; // Captured
            return {
              ...prev,
              turnsLeft: prev.turnsLeft - 1,
              square: nextSquare,
            };
          });
        }

        // Decrease modifier turns
        setLavaTiles((prev) =>
          prev
            .map((l) => ({ ...l, turnsLeft: l.turnsLeft - 1 }))
            .filter((l) => l.turnsLeft > 0),
        );
        setFloodedTiles((prev) =>
          prev
            .map((f) => ({ ...f, turnsLeft: f.turnsLeft - 1 }))
            .filter((f) => f.turnsLeft > 0),
        );

        if (chaosMode && chaosMode.active) {
          const nextTurns = chaosMode.turnsLeft - 1;
          if (nextTurns <= 0) {
            let wCount = 0;
            let bCount = 0;
            newGame.board().forEach((r) =>
              r.forEach((p) => {
                if (p) {
                  if (p.color === "w") wCount++;
                  else bCount++;
                }
              }),
            );
            if (wCount > bCount) setChaosWinner(whiteFaction.toUpperCase());
            else if (bCount > wCount)
              setChaosWinner(blackFaction.toUpperCase());
            else setChaosWinner("TIE");
          } else {
            setChaosMode({ active: true, turnsLeft: nextTurns });
          }
        }

        // Lava Capture
        if (lavaTiles.some((l) => l.square === move.to)) {
          newGame.remove(move.to as Square);
          setDiceGlowPiece((prev) =>
            prev && (prev.square === move.from || prev.square === move.to)
              ? null
              : prev,
          );
          if (moveResult.color === "w")
            setCapturedWhite((prev) => [...prev, moveResult.piece]);
          else setCapturedBlack((prev) => [...prev, moveResult.piece]);
        }

        let newEventTiles = [...eventTiles];

        if (eventTiles.includes(move.to)) {
          newEventTiles = newEventTiles.filter((t) => t !== move.to);
          const type =
            EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
          setActiveEvent({ square: move.to, type });
        }

        const newMoveCount = moveCount + 1;
        setMoveCount(newMoveCount);

        if (newMoveCount > 0 && newMoveCount % 4 === 0) {
          const emptySquares = getEmptySquares(newGame);
          const possibleTiles = emptySquares.filter(
            (s) => !newEventTiles.includes(s),
          );
          if (possibleTiles.length > 0) {
            const randomSquare =
              possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
            newEventTiles.push(randomSquare);
          }
        }

        setEventTiles(newEventTiles);
        setGame(newGame);
      } catch (e) {
        console.error("Invalid move", e);
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      // If clicked on another piece of the same color, select it
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(getPossibleMoves(game, square));
      } else {
        // Deselect
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
  };

  const board = game.board();
  const pieceImages = getPieceImages(whiteFaction, blackFaction);

  // --- AI LOGIC ---
  useEffect(() => {
    if (
      gameMode === "pve" &&
      gameStarted &&
      game.turn() !== playerSide &&
      !aiMoveQueued
    ) {
      if (
        checkIsGameOver() ||
        isMenuOpen ||
        pendingPromotion ||
        activeEvent ||
        isRollingDice ||
        pendingHolyLight ||
        pendingMomentumJump ||
        (ironWill !== null && ironWill.turnsLeft === 0)
      )
        return;

      const timer = setTimeout(() => {
        // Roll dice of fate randomly if AI has uses available (25% chance per turn)
        const aiColor = game.turn();
        const diceRolls = aiColor === "w" ? whiteDiceRolls : blackDiceRolls;
        const maxRolls = 2 + Math.floor(Math.ceil(moveCount / 2) / 7);
        if (diceRolls < maxRolls && Math.random() < 0.25) {
          // Find a piece to apply the dice effect
          const pieces = [];
          game.board().forEach((row, ri) =>
            row.forEach((p, fi) => {
              const sqStr = String.fromCharCode(97 + fi) + (8 - ri);
              if (
                p &&
                p.color === aiColor &&
                (!diceGlowPiece || diceGlowPiece.square !== sqStr)
              ) {
                pieces.push(sqStr);
              }
            }),
          );
          if (pieces.length > 0) {
            const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
            setSelectedSquare(randPiece as import("chess.js").Square);

            // Trigger dice
            setIsRollingDice(true);
            let frames = 0;
            const interval = setInterval(() => {
              setRollingDiceValue(Math.floor(Math.random() * 6) + 1);
              frames++;
              if (frames > 15) {
                clearInterval(interval);
                setIsRollingDice(false);

                let roll = Math.floor(Math.random() * 6) + 1;
                let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, game.turn() as "w"|"b", randPiece as import("chess.js").Square);
                setGame(newGame);

                let diceColor = game.turn();
                if (diceColor === "w") {
                  setWhiteDiceRolls((prev) => prev + 1);
                } else {
                  setBlackDiceRolls((prev) => prev + 1);
                }
                setDiceRollResult({
                  player: diceColor as "w" | "b",
                  dice: roll,
                  msg: actualMsg,
                });
                if (roll === 2) {
                  setDiceGlowPiece({
                    square: finalSquare,
                    turnsLeft: 2,
                    color: diceColor,
                  });
                }
                setSelectedSquare(null);
                setPossibleMoves([]);

                // Now wait before generating move
                setTimeout(() => {
                  setDiceRollResult(null); // dismiss popup
                }, 2000);
              }
            }, 100);
            return; // Wait for next effect to generate move
          }
        }

        // Decide move
        let allAllowedMoves: import("chess.js").Move[] = [];
        let rawMovesLength = 0;
        game.board().forEach((row, ri) => {
          row.forEach((p, fi) => {
            if (p && p.color === game.turn()) {
              const sq = (String.fromCharCode(97 + fi) + (8 - ri)) as import("chess.js").Square;
              const proxyMoves = game.moves({ square: sq, verbose: true });
              rawMovesLength += proxyMoves.length;
              allAllowedMoves.push(...getPossibleMoves(game, sq));
            }
          });
        });

        if (allAllowedMoves.length === 0 && rawMovesLength > 0) {
          // UI modifiers blocked all moves, allow AI to power through obstacles to prevent softlock
          game.board().forEach((row, ri) => {
            row.forEach((p, fi) => {
              if (p && p.color === game.turn()) {
                const sq = (String.fromCharCode(97 + fi) + (8 - ri)) as import("chess.js").Square;
                allAllowedMoves.push(...(game.moves({ square: sq, verbose: true }) as import("chess.js").Move[]));
              }
            });
          });
        }

        if (allAllowedMoves.length === 0) return;

        // Optionally try to avoid lava if possible
        let preferredMoves = allAllowedMoves.filter(
          (m: any) => !lavaTiles.some((l) => l.square === m.to),
        );
        if (preferredMoves.length === 0) preferredMoves = allAllowedMoves;

        let moves = preferredMoves;
        const aiPoints = game.turn() === "w" ? whitePoints : blackPoints;
        if (aiPoints < 3) moves = moves.filter((m: any) => !m.promotion);
        if (moves.length === 0) moves = preferredMoves;
        if (moves.length === 0) moves = allAllowedMoves;
        if (moves.length === 0) {
          return;
        }

        const captures = moves.filter((m: any) => m.captured);
        const m =
          captures.length > 0
            ? captures[Math.floor(Math.random() * captures.length)]
            : moves[Math.floor(Math.random() * moves.length)];
        
        if (m.promotion) {
           const available = ["q", "r", "b", "n"].filter((t) => {
             const cost = t === "q" ? 10 : t === "r" ? 7 : 3;
             return aiPoints >= cost;
           });
           const pick =
              available.length > 0
                ? available[Math.floor(Math.random() * available.length)]
                : "q";
           m.promotion = pick as import("chess.js").PieceSymbol;
        }

        setAiMoveQueued(m);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    gameMode,
    gameStarted,
    game.fen(),
    playerSide,
    isMenuOpen,
    pendingPromotion,
    activeEvent,
    isRollingDice,
    pendingHolyLight,
    pendingMomentumJump,
    ironWill,
    whitePoints,
    blackPoints,
    aiMoveQueued,
    whiteDiceRolls,
    blackDiceRolls,
    moveCount,
    diceRollResult,
  ]);

  useEffect(() => {
    if (aiMoveQueued && !isRollingDice && !diceRollResult) {
      if (!selectedSquare || selectedSquare !== aiMoveQueued.from) {
        setSelectedSquare(aiMoveQueued.from as import("chess.js").Square);
      } else {
        // Let UI render the selection briefly
        const timer = setTimeout(() => {
          const newGame = new Chess(game.fen());
          try {
            let moveResult;
            try {
              let moveParams: any = { from: aiMoveQueued.from, to: aiMoveQueued.to };
              if (aiMoveQueued.promotion) moveParams.promotion = aiMoveQueued.promotion;
              moveResult = newGame.move(moveParams);
            } catch (e) {}

            if (!moveResult) {
              const capTarget = newGame.get(aiMoveQueued.to as import("chess.js").Square);
              const p = newGame.get(aiMoveQueued.from as import("chess.js").Square);
              const pType: any = p ? p.type : (aiMoveQueued.piece || "k");
              moveResult = {
                color: game.turn(),
                from: aiMoveQueued.from,
                to: aiMoveQueued.to,
                piece: pType,
                captured: capTarget ? capTarget.type : undefined,
              };
              newGame.remove(aiMoveQueued.from as import("chess.js").Square);
              newGame.put(
                { type: pType, color: game.turn() },
                aiMoveQueued.to as import("chess.js").Square,
              );
              
              const tokens = newGame.fen().split(" ");
              tokens[1] = tokens[1] === "w" ? "b" : "w";
              tokens[2] = "-";
              tokens[3] = "-";
              try {
                newGame.load(tokens.join(" "));
              } catch (e) {}
            }
            
            setTimeout(() => {
              if (moveResult.captured) playCaptureSfx();
              else playMoveSfx();
            }, 250);

            setCustomHistory((prev) => [...prev, moveResult]);

            if (moveResult && moveResult.captured) {
              setTimeout(() => {
                setCaptureAnim({ square: moveResult.to, id: Date.now() });
                setTimeout(() => setCaptureAnim(null), 600);
              }, 250);
              
              if (moveResult.color === "w")
                setCapturedBlack((prev) => [...prev, moveResult.captured!]);
              else if (moveResult.color === "b")
                setCapturedWhite((prev) => [...prev, moveResult.captured!]);
                
              const capturePoints =
                PIECE_VALUES[moveResult.captured] || 0;
              if (moveResult.color === "w") {
                setWhitePoints((prev) => prev + capturePoints);
              } else {
                setBlackPoints((prev) => prev + capturePoints);
              }
            }

            // Deduct points for AI promotion
            if (aiMoveQueued.promotion) {
              const promoCost =
                aiMoveQueued.promotion === "q"
                  ? 10
                  : aiMoveQueued.promotion === "r"
                    ? 7
                    : 3;
              if (game.turn() === "w") {
                setWhitePoints((prev) => Math.max(0, prev - promoCost));
              } else {
                setBlackPoints((prev) => Math.max(0, prev - promoCost));
              }
            }


            // Decrease modifier turns
            if (ironWill) {
              setIronWill((prev) =>
                prev && prev.turnsLeft > 1
                  ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
                  : prev
                    ? null
                    : null,
              );
            }

            if (holyLightPiece && holyLightPiece.color !== moveResult.color) {
              setHolyLightPiece((prev) =>
                prev && prev.turnsLeft > 1
                  ? { ...prev, turnsLeft: prev.turnsLeft - 1 }
                  : null,
              );
            } else if (
              holyLightPiece &&
              holyLightPiece.color === moveResult.color &&
              holyLightPiece.turnsLeft <= 1
            ) {
              setHolyLightPiece(null);
            }

            if (
              moveResult &&
              moveResult.piece === "n" &&
              activeKnightMomentum === moveResult.from
            ) {
              setPendingMomentumJump({
                square: moveResult.to,
                color: moveResult.color,
              });
              setActiveKnightMomentum(null);
            }

            // Handle dice glow turns
            if (diceGlowPiece) {
              setDiceGlowPiece((prev) => {
                if (!prev || prev.turnsLeft <= 1) return null;
                let nextSquare = prev.square;
                if (prev.square === moveResult.from) nextSquare = moveResult.to as string;
                else if (prev.square === moveResult.to) return null; // Captured
                return {
                  ...prev,
                  turnsLeft: prev.turnsLeft - 1,
                  square: nextSquare,
                };
              });
            }

            // Decrease modifier turns
            setLavaTiles((prev) =>
              prev
                .map((l) => ({ ...l, turnsLeft: l.turnsLeft - 1 }))
                .filter((l) => l.turnsLeft > 0),
            );
            setFloodedTiles((prev) =>
              prev
                .map((f) => ({ ...f, turnsLeft: f.turnsLeft - 1 }))
                .filter((f) => f.turnsLeft > 0),
            );

            if (chaosMode && chaosMode.active) {
              const nextTurns = chaosMode.turnsLeft - 1;
              if (nextTurns <= 0) {
                let wCount = 0;
                let bCount = 0;
                newGame.board().forEach((r) =>
                  r.forEach((p) => {
                    if (p) {
                      if (p.color === "w") wCount++;
                      else bCount++;
                    }
                  }),
                );
                if (wCount > bCount) setChaosWinner(whiteFaction.toUpperCase());
                else if (bCount > wCount)
                  setChaosWinner(blackFaction.toUpperCase());
                else setChaosWinner("TIE");
              } else {
                setChaosMode({ active: true, turnsLeft: nextTurns });
              }
            }

            // Lava Capture
            if (lavaTiles.some((l) => l.square === moveResult.to)) {
              newGame.remove(moveResult.to as import("chess.js").Square);
              setDiceGlowPiece((prev) =>
                prev && (prev.square === moveResult.from || prev.square === moveResult.to)
                  ? null
                  : prev,
              );
              if (moveResult.color === "w")
                setCapturedWhite((prev) => [...prev, moveResult.piece as string]);
              else setCapturedBlack((prev) => [...prev, moveResult.piece as string]);
            }

            let newEventTiles = [...eventTiles];
            const finalSquare = aiMoveQueued.to;
            if (eventTiles.includes(finalSquare)) {
              newEventTiles = newEventTiles.filter((sq) => sq !== finalSquare);
              const type =
                EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
              setActiveEvent({ square: finalSquare, type });
            }

            const newMoveCount = moveCount + 1;
            if (newMoveCount > 0 && newMoveCount % 4 === 0) {
              const emptySquares = getEmptySquares(newGame);
              const possibleTiles = emptySquares.filter(
                (s) => !newEventTiles.includes(s),
              );
              if (possibleTiles.length > 0) {
                const randomSquare =
                  possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
                newEventTiles.push(randomSquare);
              }
            }
            setEventTiles(newEventTiles);

            // End turn updates
            setMoveCount(newMoveCount);
            setGame(newGame);
            setSelectedSquare(null);
            setPossibleMoves([]);
          } catch (e) {
            console.error("AI Move failed", e);
          }
          setAiMoveQueued(null); // Clear queue
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [aiMoveQueued, selectedSquare, isRollingDice, diceRollResult, game, eventTiles, moveCount]);

  useEffect(() => {
    if (gameMode !== "pve") return;

    let timer: any;
    const aiColor = playerSide === "w" ? "b" : "w";

    if (activeEvent) {
      const piece = game.get(activeEvent.square as import("chess.js").Square);
      // Determine if AI triggered the event. Usually whoever's turn it is NOT triggered it.
      // E.g. game.turn() is playerSide now, which means AI just ended its turn and triggered the event.
      const triggerColor = piece
        ? piece.color
        : game.turn() === "w"
          ? "b"
          : "w";

      if (triggerColor === aiColor) {
        timer = setTimeout(() => {
          handleEventContinue();

          // AI might use Dice of Fate after event
          const diceRolls = aiColor === "w" ? whiteDiceRolls : blackDiceRolls;
          // Note: Move was just made by AI, so moveCount is larger
          const maxRolls = 2 + Math.floor(Math.ceil((moveCount + 1) / 2) / 7);
          if (diceRolls < maxRolls && Math.random() < 0.25) {
            const pieces = [];
            game.board().forEach((row, ri) =>
              row.forEach((p, fi) => {
                if (p && p.color === aiColor) {
                  pieces.push(String.fromCharCode(97 + fi) + (8 - ri));
                }
              }),
            );
            if (pieces.length > 0) {
              const randPiece =
                pieces[Math.floor(Math.random() * pieces.length)];
              setSelectedSquare(randPiece as import("chess.js").Square);

              setIsRollingDice(true);
              let frames = 0;
              const interval = setInterval(() => {
                setRollingDiceValue(Math.floor(Math.random() * 6) + 1);
                frames++;
                if (frames > 15) {
                  clearInterval(interval);
                  setIsRollingDice(false);

                  let roll = Math.floor(Math.random() * 6) + 1;
                  let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, aiColor as "w"|"b", randPiece as import("chess.js").Square);
                  setGame(newGame);

                  if (aiColor === "w") {
                    setWhiteDiceRolls((prev) => prev + 1);
                  } else {
                    setBlackDiceRolls((prev) => prev + 1);
                  }
                  setDiceRollResult({ player: aiColor, dice: roll, msg: actualMsg });
                  if (roll === 2) {
                    setDiceGlowPiece({
                      square: finalSquare,
                      turnsLeft: 2,
                      color: aiColor,
                    });
                  }
                  setSelectedSquare(null);
                  setPossibleMoves([]);
                  
                  setTimeout(() => {
                    setDiceRollResult(null);
                  }, 2000);

                  setTimeout(() => {
                    setDiceRollResult(null);
                  }, 2000);
                }
              }, 100);
            }
          }
        }, 800);
      }
    }

    return () => clearTimeout(timer);
  }, [
    gameMode,
    playerSide,
    activeEvent,
    pendingPromotion,
    game.fen(),
    whitePoints,
    blackPoints,
    moveCount,
    whiteDiceRolls,
    blackDiceRolls,
  ]);
  // --- END AI LOGIC ---

  if (!hasInteracted) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 font-sans relative cursor-pointer"
        style={{ backgroundColor: "#111015" }}
        onClick={() => {
          setHasInteracted(true);
          playButtonSfx();
          if (bgmRefMenu.current) bgmRefMenu.current.play().catch(() => {});
        }}
      >
        <audio
          ref={bgmRefMenu}
          src="/AUDIO/Kubbi-UpInMyJam.mp3"
          loop
        />
        <div
          className="bg-[#2c241c] border-4 border-[#4a3f35] p-6 sm:p-8 text-center flex flex-col gap-8 w-full max-w-2xl relative z-10 transition hover:bg-[#3d3227]"
          style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-mono text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
            style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
          >
            Fantasia Chess
          </h1>
          <p className="text-white font-mono animate-pulse text-xl">
            Click Anywhere to Enter
          </p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    const startGame = () => {
      playButtonSfx();
      setGame(new Chess());
      setSelectedSquare(null);
      setPossibleMoves([]);
      setWhiteTime(INITIAL_TIME);
      setBlackTime(INITIAL_TIME);
      setWhitePoints(0);
      setBlackPoints(0);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setLavaTiles([]);
      setFloodedTiles([]);
      setChaosMode(null);
      setChaosWinner(null);
      setEventWinner(null);
      setMoveCount(0);
      setCustomHistory([]);
      setImageErrors({});
      setEventTiles(generateEventTiles());
      setGameStarted(true);
      setAiMoveQueued(null);
      setWhiteDiceRolls(0);
      setBlackDiceRolls(0);
      setDiceRollResult(null);
      setActiveEvent(null);
      setIronWill(null);
      setQueenLastMoveW(null);
      setQueenLastMoveB(null);
      setHolyLightPiece(null);
      setPendingHolyLight(null);
      setActiveKnightMomentum(null);
      setPendingMomentumJump(null);
      setDiceGlowPiece(null);
      setSkillUses({
        w: { q: 0, r: 0, b: 0, n: 0, k: 0 },
        b: { q: 0, r: 0, b: 0, n: 0, k: 0 },
      });
    };

    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 font-sans relative"
        style={{
          backgroundColor: "#111015",
          filter: `brightness(${brightness}%)`,
          transition: "filter 0.3s ease",
        }}
      >
        <audio
        ref={bgmRefMenu}
        src="/AUDIO/Kubbi-UpInMyJam.mp3"
        autoPlay
        loop
      />
        <div
          className="bg-[#2c241c] border-4 border-[#4a3f35] p-6 sm:p-8 text-center flex flex-col gap-8 w-full max-w-2xl relative z-10"
          style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-mono text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
            style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
          >
            Fantasia Chess
          </h1>

          {isSettingsOpen ? (
            <div className="animate-fade-in flex flex-col gap-4">
              <h2
                className="text-2xl sm:text-3xl font-mono text-[#d4af37] mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
                style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
              >
                SETTINGS
              </h2>

              <div className="flex flex-col gap-6 text-left mb-6">
                {/* View Mode */}
                <div>
                  <div className="text-[#d1c8b8] font-mono mb-2 text-sm">
                    VIEW MODE
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        playButtonSfx();
                        if (
                          document.fullscreenElement &&
                          document.exitFullscreen
                        ) {
                          document.exitFullscreen();
                        }
                      }}
                      className={`flex-1 font-mono text-sm py-2 px-2 border-2 transition-colors ${!isFullscreen ? "bg-[#5c4f42] border-[#d4af37] text-white" : "bg-[#2c241c] border-[#3d3227] text-[#807662] hover:border-[#5c4f42]"}`}
                    >
                      WINDOWED
                    </button>
                    <button
                      onClick={() => {
                        playButtonSfx();
                        if (!document.fullscreenElement) {
                          document.documentElement
                            .requestFullscreen()
                            .catch(() => {});
                        }
                      }}
                      className={`flex-1 font-mono text-sm py-2 px-2 border-2 transition-colors ${isFullscreen ? "bg-[#5c4f42] border-[#d4af37] text-white" : "bg-[#2c241c] border-[#3d3227] text-[#807662] hover:border-[#5c4f42]"}`}
                    >
                      FULL SCREEN
                    </button>
                  </div>
                </div>

                {/* Brightness */}
                <div>
                  <div className="text-[#d1c8b8] font-mono mb-2 text-sm flex justify-between">
                    <span>BRIGHTNESS</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Volume */}
                <div>
                  <div className="text-[#d1c8b8] font-mono mb-2 text-sm flex justify-between">
                    <span>MASTER VOLUME</span>
                    <span>{masterVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  playButtonSfx();
                  setIsSettingsOpen(false);
                }}
                className="mt-4 font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg"
                style={{
                  boxShadow:
                    "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
                }}
              >
                RETURN
              </button>
            </div>
          ) : (
            <>
              {menuStep === "mode" && (
                <div className="flex flex-col gap-5 items-center animate-fade-in">
                  <h2 className="text-2xl font-mono text-white mb-4 drop-shadow-md">
                    Select Game Mode
                  </h2>
                  <button
                    onClick={() => {
                      playButtonSfx();
                      setGameMode("pvp");
                      setMenuStep("pvp-factions");
                    }}
                    className="w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition shadow-lg"
                  >
                    Player vs Player
                  </button>
                  <button
                    onClick={() => {
                      playButtonSfx();
                      setGameMode("pve");
                      setMenuStep("pve-side");
                    }}
                    className="w-64 py-4 font-mono text-xl bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:text-white transition shadow-lg"
                  >
                    Player vs AI
                  </button>
                  <button
                    onClick={() => {
                      playButtonSfx();
                      setIsSettingsOpen(true);
                    }}
                    className="w-64 py-4 mt-2 font-mono text-xl bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition border-x-4 border-y-4"
                  >
                    Settings
                  </button>
                </div>
              )}

              {menuStep === "pvp-factions" && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row gap-8 justify-center">
                    <div className="flex-1 flex flex-col items-center gap-4">
                      <h2 className="text-xl sm:text-2xl font-mono text-white">
                        White Pieces
                      </h2>
                      <div className="flex flex-col gap-4 w-full">
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setWhiteFaction("Human");
                          }}
                          className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${whiteFaction === "Human" ? "bg-[#d4af37] border-[#d4af37] text-black shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Humans
                        </button>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setWhiteFaction("Elf");
                          }}
                          className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${whiteFaction === "Elf" ? "bg-[#d4af37] border-[#d4af37] text-black shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Elves
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-4">
                      <h2 className="text-xl sm:text-2xl font-mono text-white">
                        Black Pieces
                      </h2>
                      <div className="flex flex-col gap-4 w-full">
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setBlackFaction("Undead");
                          }}
                          className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${blackFaction === "Undead" ? "bg-[#8b2626] border-[#8b2626] text-white shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Undead
                        </button>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setBlackFaction("Orc");
                          }}
                          className={`font-mono text-lg sm:text-xl py-3 px-4 border-4 transition hover:-translate-y-1 active:translate-y-0 ${blackFaction === "Orc" ? "bg-[#8b2626] border-[#8b2626] text-white shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Orcs
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 justify-center mt-4">
                    <button
                      onClick={() => {
                        playButtonSfx();
                        setMenuStep("mode");
                      }}
                      className="font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition border-x-4 border-y-4"
                    >
                      BACK
                    </button>
                    <button
                      onClick={startGame}
                      className="font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition shadow-lg"
                    >
                      START BATTLE
                    </button>
                  </div>
                </div>
              )}

              {menuStep === "pve-side" && (
                <div className="flex flex-col gap-6 items-center animate-fade-in">
                  <h2 className="text-2xl font-mono text-white mb-4 drop-shadow-md">
                    Choose Your Side
                  </h2>
                  <div className="flex gap-6 w-full justify-center">
                    <button
                      onClick={() => {
                        playButtonSfx();
                        setPlayerSide("w");
                        setMenuStep("pve-faction");
                      }}
                      className="flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#d1c8b8] text-black border-4 border-[#fff] hover:bg-[#fff] transition border-x-4 border-y-4"
                    >
                      WHITE TEAM
                    </button>
                    <button
                      onClick={() => {
                        playButtonSfx();
                        setPlayerSide("b");
                        setMenuStep("pve-faction");
                      }}
                      className="flex-1 max-w-[200px] py-6 font-mono text-xl bg-[#222] text-white border-4 border-[#000] hover:bg-[#000] transition border-x-4 border-y-4"
                    >
                      BLACK TEAM
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      playButtonSfx();
                      setMenuStep("mode");
                    }}
                    className="mt-4 font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition border-x-4 border-y-4"
                  >
                    BACK
                  </button>
                </div>
              )}

              {menuStep === "pve-faction" && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  <h2 className="text-2xl font-mono text-white">
                    Select Your Race
                  </h2>
                  <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                    {playerSide === "w" ? (
                      <>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setWhiteFaction("Human");
                          }}
                          className={`font-mono text-xl py-4 px-4 border-4 transition ${whiteFaction === "Human" ? "bg-[#d4af37] border-[#d4af37] text-black shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Humans
                        </button>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setWhiteFaction("Elf");
                          }}
                          className={`font-mono text-xl py-4 px-4 border-4 transition ${whiteFaction === "Elf" ? "bg-[#d4af37] border-[#d4af37] text-black shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Elves
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setBlackFaction("Undead");
                          }}
                          className={`font-mono text-xl py-4 px-4 border-4 transition ${blackFaction === "Undead" ? "bg-[#8b2626] border-[#8b2626] text-white shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Undead
                        </button>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            setBlackFaction("Orc");
                          }}
                          className={`font-mono text-xl py-4 px-4 border-4 transition ${blackFaction === "Orc" ? "bg-[#8b2626] border-[#8b2626] text-white shadow-lg" : "bg-[#4a3f35] border-[#2c241c] text-[#d1c8b8]"}`}
                        >
                          The Orcs
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-6 justify-center mt-4">
                    <button
                      onClick={() => {
                        playButtonSfx();
                        setMenuStep("pve-side");
                      }}
                      className="font-mono text-xl px-6 py-4 bg-[#1a1410] text-[#777] border-4 border-[#0a0806] hover:text-[#aaa] transition border-x-4 border-y-4"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => {
                        if (playerSide === "w") {
                          setBlackFaction(
                            Math.random() > 0.5 ? "Undead" : "Orc",
                          );
                        } else {
                          setWhiteFaction(
                            Math.random() > 0.5 ? "Human" : "Elf",
                          );
                        }
                        startGame();
                      }}
                      className="font-mono text-2xl px-8 py-4 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] transition shadow-lg border-x-4 border-y-4"
                    >
                      START BATTLE
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col xl:flex-row items-center xl:items-start xl:justify-center min-h-screen p-4 py-8 sm:py-12 font-sans relative gap-8"
      style={{
        backgroundColor: "#111015",
        filter: `brightness(${brightness}%)`,
        transition: "filter 0.3s ease",
      }}
    >
      <audio
        ref={bgmRefGame}
        src="/AUDIO/Faxanadu-LandOfTheDwarves.mp3"
        autoPlay
        loop
      />
      <div className="flex flex-col items-center flex-shrink-0 w-full max-w-[640px]">
        <div className="flex flex-wrap items-center justify-between w-full mb-4 relative z-10 gap-x-2 gap-y-4">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-mono text-[#d4af37] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
            style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
          >
            Fantasia Chess
          </h1>
          <div className="flex gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs">
            <button
              onClick={() => {
                playButtonSfx();
                setIsAbilitiesGuideOpen(true);
              }}
              className="px-2 sm:px-4 py-2 sm:py-3 bg-[#4a3f35] text-[#d1c8b8] border-2 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition"
              style={{
                boxShadow:
                  "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
              }}
            >
              ABILITIES
            </button>
            <button
              onClick={() => {
                playButtonSfx();
                setIsMenuOpen(true);
              }}
              className="hidden sm:block px-2 sm:px-4 py-2 sm:py-3 bg-[#4a3f35] text-[#d1c8b8] border-2 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition"
              style={{
                boxShadow:
                  "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
              }}
            >
              PAUSE
            </button>

            <button
              onClick={() => {
                playButtonSfx();
                setGame(new Chess());
                setSelectedSquare(null);
                setPossibleMoves([]);
                setWhiteTime(INITIAL_TIME);
                setBlackTime(INITIAL_TIME);
                setIsMenuOpen(false);
                setGameStarted(false);
                setWhitePoints(0);
                setBlackPoints(0);
                setAiMoveQueued(null);
                setMenuStep("mode");
                setCapturedWhite([]);
                setCapturedBlack([]);
                setLavaTiles([]);
                setFloodedTiles([]);
                setChaosMode(null);
                setChaosWinner(null);
                setEventWinner(null);
                setMoveCount(0);
                setWhiteDiceRolls(0);
                setBlackDiceRolls(0);
                setDiceRollResult(null);
                setEventTiles([]);
                setActiveEvent(null);
                setIronWill(null);
                setQueenLastMoveW(null);
                setQueenLastMoveB(null);
                setHolyLightPiece(null);
                setPendingHolyLight(null);
                setActiveKnightMomentum(null);
                setPendingMomentumJump(null);
                setSkillUses({
                  w: { q: 0, r: 0, b: 0, n: 0, k: 0 },
                  b: { q: 0, r: 0, b: 0, n: 0, k: 0 },
                });
              }}
              className="px-2 sm:px-4 py-2 sm:py-3 bg-[#8b2626] text-[#ffcccb] border-2 border-[#4a1111] hover:bg-[#a63030] transition shadow-lg"
              style={{
                boxShadow:
                  "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.2)",
              }}
            >
              QUIT
            </button>
          </div>
        </div>

        {/* Turn indicator and status */}
        {(game.isCheck() ||
          game.isStalemate() ||
          game.isDraw() ||
          whiteTime === 0 ||
          blackTime === 0 ||
          chaosMode ||
          chaosWinner ||
          eventWinner ||
          pendingHolyLight ||
          pendingMomentumJump) && (
          <div
            className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center text-xl sm:text-2xl text-[#ff5555] animate-pulse drop-shadow-md font-mono z-[100] font-bold pointer-events-none bg-black/80 px-4 sm:px-8 py-2 sm:py-4 border-2 border-[#ff5555] rounded backdrop-blur-sm"
            style={{
              textShadow: "1px 1px 0px #000",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.8)",
            }}
          >
            {pendingHolyLight && <div>SELECT ALLIED PIECE TO BLESS</div>}
            {pendingMomentumJump && <div>SELECT ADJACENT TILE TO JUMP</div>}
            {chaosMode && !chaosWinner && !eventWinner && (
              <div>
                CHAOS MODE: {Math.ceil(chaosMode.turnsLeft / 2)} TURNS LEFT!
              </div>
            )}
            {chaosWinner && (
              <div>
                {chaosWinner === "TIE"
                  ? "A TIE VIA SURVIVAL!"
                  : `${chaosWinner} WON VIA SURVIVAL!`}
              </div>
            )}
            {eventWinner && (
              <div>
                {eventWinner === "TIE"
                  ? "MUTUAL KING ELIMINATION!"
                  : `${eventWinner} WON BY KING ELIMINATION!`}
              </div>
            )}
            {!chaosWinner &&
              !eventWinner &&
              capturedWhite.includes("k") &&
              capturedBlack.includes("k") && <div>MUTUAL DESTRUCTION</div>}
            {!chaosWinner &&
              !eventWinner &&
              !capturedWhite.includes("k") &&
              !capturedBlack.includes("k") &&
              game.isCheck() &&
              !checkIsCheckmate() && <div>CHECK!</div>}
            {!chaosWinner &&
              !eventWinner &&
              !capturedWhite.includes("k") &&
              !capturedBlack.includes("k") &&
              game.isDraw() &&
              !game.isStalemate() && <div>DRAW</div>}
            {!chaosWinner && !eventWinner && game.isStalemate() && (
              <div>STALEMATE</div>
            )}
            {!chaosWinner && !eventWinner && whiteTime === 0 && (
              <div>WHITE OUT OF TIME</div>
            )}
            {!chaosWinner && !eventWinner && blackTime === 0 && (
              <div>BLACK OUT OF TIME</div>
            )}
          </div>
        )}

        {/* Black Player Info (TOP) */}
        <div
          className={`mb-2 w-full max-w-[384px] sm:max-w-[512px] md:max-w-[640px] flex justify-between items-center bg-[#2c241c] p-2 sm:p-4 border-4 ${game.turn() === "b" ? "border-[#d4af37]" : "border-[#1a1410]"} font-mono text-[10px] sm:text-sm relative z-10 transition-colors duration-300`}
          style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.5)" }}
        >
          <div className="text-[#d1c8b8] flex items-center gap-2 sm:gap-3 tracking-widest font-bold">
            <div
              className={`w-3 h-3 sm:w-4 sm:h-4 border-2 border-black bg-[#1a1410]`}
            ></div>
            <span className="hidden sm:inline">
              BLACK ({blackFaction.toUpperCase()})
            </span>
            <span className="sm:hidden">
              BLK ({blackFaction.toUpperCase()})
            </span>
          </div>
          <div
            className={`text-sm sm:text-xl font-bold ${game.turn() === "b" ? "text-[#d4af37]" : "text-[#d1c8b8]"}`}
          >
            PTS: {blackPoints} | {formatTime(blackTime)}
          </div>
        </div>

        {/* Board */}
        {/* Enable this pattern if you want to use the board image mask or background */}
        <div
          className="border-8 border-[#3d3227] relative z-10"
          style={{
            boxShadow: "8px 8px 0px rgba(0,0,0,0.6)",
            // backgroundImage: `url('/Board.png')`, // Uncomment to put the Board image behind the squares
            // backgroundSize: 'cover'
          }}
        >
          {board.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="flex">
                {row.map((piece, colIndex) => {
                  const squareName = (String.fromCharCode(97 + colIndex) +
                    (8 - rowIndex)) as Square;

                  const isDark = (rowIndex + colIndex) % 2 === 1;
                  // Fantasy colors - Dark grey stone vs Old wood
                  const squareColorClass = isDark
                    ? "bg-[#3e4247]"
                    : "bg-[#807662]";

                  const isSelected = selectedSquare === squareName;
                  const isPossibleMove = possibleMoves.some(
                    (m) => m.to === squareName,
                  );

                  let showSkillButton = false;
                  let canActivateSkill = true;
                  let skillRequirementText = "";

                  if (
                    isSelected &&
                    piece &&
                    piece.color === game.turn() &&
                    ["r", "n", "b", "q", "k"].includes(piece.type) &&
                    !checkIsGameOver() &&
                    !chaosWinner &&
                    !eventWinner &&
                    !(ironWill && ironWill.turnsLeft === 0)
                  ) {
                    showSkillButton = true;

                    const currentPoints =
                      game.turn() === "w" ? whitePoints : blackPoints;

                    if (royalPanic && royalPanic.color === piece.color) {
                      canActivateSkill = false;
                      skillRequirementText = "ROYAL PANIC (DISABLED)";
                    } else if (piece.type === "k") {
                      let pieceCount = 0;
                      board.forEach((r) =>
                        r.forEach((p) => {
                          if (p && p.color === piece.color) pieceCount++;
                        }),
                      );
                      const hasOnlyKing = pieceCount === 1;
                      canActivateSkill = hasOnlyKing && !ironWill;
                      if (!canActivateSkill) {
                        skillRequirementText = ironWill
                          ? `ACTIVE (${ironWill.capturesMade}/3 CAPTURES)`
                          : "REQ: ALONE";
                      }
                    } else if (piece.type === "q") {
                      const lastQM =
                        piece.color === "w" ? queenLastMoveW : queenLastMoveB;
                      const uses =
                        piece.color === "w" ? skillUses.w.q : skillUses.b.q;
                      canActivateSkill =
                        uses < 1 &&
                        lastQM !== null &&
                        !lastQM.captured &&
                        currentPoints >= 7;
                      if (!canActivateSkill) {
                        if (uses >= 1) skillRequirementText = "EXHAUSTED";
                        else if (lastQM === null)
                          skillRequirementText = "NO RECENT MOVES";
                        else if (lastQM.captured)
                          skillRequirementText = "CAPTURED LAST MOVE";
                        else skillRequirementText = "NOT ENOUGH PTS (7)";
                      }
                    } else if (piece.type === "r") {
                      const uses =
                        piece.color === "w" ? skillUses.w.r : skillUses.b.r;
                      canActivateSkill =
                        uses < 1 && !game.isCheck() && currentPoints >= 7;
                      if (!canActivateSkill) {
                        if (uses >= 1) skillRequirementText = "EXHAUSTED";
                        else if (game.isCheck())
                          skillRequirementText = "CANNOT BE CHECKED";
                        else skillRequirementText = "NOT ENOUGH PTS (7)";
                      }
                    } else if (piece.type === "b") {
                      const uses =
                        piece.color === "w" ? skillUses.w.b : skillUses.b.b;
                      canActivateSkill =
                        uses < 2 && !holyLightPiece && currentPoints >= 6;
                      if (!canActivateSkill) {
                        if (uses >= 2) skillRequirementText = "EXHAUSTED";
                        else if (holyLightPiece)
                          skillRequirementText = "ALREADY ACTIVE";
                        else skillRequirementText = "NOT ENOUGH PTS (6)";
                      }
                    } else if (piece.type === "n") {
                      const uses =
                        piece.color === "w" ? skillUses.w.n : skillUses.b.n;
                      canActivateSkill =
                        uses < 3 &&
                        activeKnightMomentum !== squareName &&
                        currentPoints >= 6;
                      if (!canActivateSkill) {
                        if (uses >= 3) skillRequirementText = "EXHAUSTED";
                        else if (activeKnightMomentum === squareName)
                          skillRequirementText = "ALREADY ACTIVE";
                        else skillRequirementText = "NOT ENOUGH PTS (6)";
                      }
                    }
                  }

                  // Styling
                  let bgClass = squareColorClass;
                  if (isSelected) {
                    bgClass = isDark ? "bg-[#6c6f44]" : "bg-[#a6ad5d]";
                  }

                  const zIndexClass = showSkillButton
                    ? "z-[60]"
                    : isSelected
                      ? "z-50"
                      : "z-10";

                  const pieceSymbol = piece ? PIECES[piece.type] : "";
                  const pieceKey = piece ? `${piece.color}_${piece.type}` : "";
                  const pieceImage = pieceKey
                    ? pieceImages[pieceKey]
                    : undefined;
                  const showImage = pieceImage && !imageErrors[pieceKey];

                  // Keep unicode styling as fallback
                  const pieceStyle =
                    piece?.color === "w"
                      ? {
                          color: "#ffffff",
                          WebkitTextStroke: "2px #222222",
                          textShadow: "0 4px 6px rgba(0, 0, 0, 0.4)",
                        }
                      : {
                          color: "#222222",
                          WebkitTextStroke: "1px #ffffff",
                          textShadow: "0 4px 6px rgba(0, 0, 0, 0.6)",
                        };

                  return (
                    <div
                      key={squareName}
                      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer ${bgClass} relative transition-all duration-200 hover:brightness-110 ${zIndexClass}`}
                      onClick={() => {
                        if (
                          gameMode === "pve" && 
                          game.turn() !== playerSide && 
                          !pendingMomentumJump
                        )
                          return;
                        onSquareClick(squareName);
                      }}
                      style={{
                        // Subtle inner borders for medieval retro feel
                        boxShadow:
                          "inset 2px 2px 0px rgba(255,255,255,0.05), inset -2px -2px 0px rgba(0,0,0,0.2)",
                      }}
                    >
                      {/* Pieces */}
                      {piece && (
                        <div
                          className={`w-full h-full flex items-center justify-center relative z-10 transition-opacity ${
                            animMove &&
                            animMove.toCol === colIndex &&
                            animMove.toRow === rowIndex
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                        >
                          {showImage ? (
                            <img
                              src={pieceImage}
                              alt={pieceKey}
                              onError={() => handleImageError(pieceKey)}
                              className={`w-[80%] h-[80%] object-contain select-none drop-shadow-lg transition-transform will-change-transform pixelated ${
                                isSelected
                                  ? "piece-selected scale-110"
                                  : "hover:scale-110"
                              }`}
                              style={{ imageRendering: "pixelated" }}
                            />
                          ) : (
                            pieceSymbol && (
                              <span
                                className={`select-none transition-transform will-change-transform ${
                                  isSelected
                                    ? "piece-selected scale-110"
                                    : "hover:scale-110"
                                }`}
                                style={pieceStyle}
                              >
                                {pieceSymbol}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {/* Capture Animation */}
                      {captureAnim && captureAnim.square === squareName && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center animate-ping pointer-events-none">
                          <div
                            className="w-[120%] h-[120%] opacity-80"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(255,200,50,1) 0%, rgba(255,50,50,0.8) 40%, rgba(200,0,0,0) 70%)",
                            }}
                          />
                        </div>
                      )}

                      {/* Event Tile Highlight */}
                      {eventTiles.includes(squareName) && !pieceSymbol && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 z-10 transition-opacity">
                          <div
                            className="w-[60%] h-[60%] border-2 border-[#d4af37] rounded flex items-center justify-center animate-[spin_4s_linear_infinite]"
                            style={{
                              boxShadow:
                                "0 0 10px #d4af37, inset 0 0 10px #d4af37",
                            }}
                          >
                            <div className="w-[80%] h-[80%] bg-[#d4af37] blur-md opacity-50 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {/* Move highlight point */}
                      {isPossibleMove && !pieceSymbol && (
                        <div className="w-[20%] h-[20%] border-4 border-[#ff0000] opacity-50 z-0 drop-shadow-[0_0_5px_rgba(255,0,0,1)]" />
                      )}

                      {/* Iron Will Aura */}
                      {ironWill &&
                        ironWill.color === piece?.color &&
                        piece?.type === "k" && (
                          <div className="absolute inset-2 border-4 border-[#ffaa00] z-20 pointer-events-none rounded-full drop-shadow-[0_0_8px_rgba(255,170,0,1)] animate-[pulse_1s_infinite]" />
                        )}

                      {/* Dice Glow Aura */}
                      {diceGlowPiece && diceGlowPiece.square === squareName && (
                        <div
                          className="absolute inset-0 bg-[#d4af37]/40 z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(212,175,55,1)] animate-[pulse_1.5s_infinite]"
                          style={{
                            boxShadow: "inset 0 0 20px rgba(212,175,55,0.8)",
                          }}
                        />
                      )}

                      {/* Holy Light Aura */}
                      {holyLightPiece &&
                        holyLightPiece.square === squareName && (
                          <div className="absolute inset-0 bg-[#ffffff]/30 z-20 pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,1)] animate-pulse shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]" />
                        )}

                      {/* Move highlight for capture */}
                      {isPossibleMove && pieceSymbol && (
                        <div className="absolute inset-0 border-4 sm:border-[6px] border-[#ff0000] z-0 pointer-events-none drop-shadow-[0_0_5px_rgba(255,0,0,1)]" />
                      )}

                      {/* Lava/Flooded Tile Overlay */}
                      {lavaTiles.some((l) => l.square === squareName) && (
                        <div className="absolute inset-0 bg-red-600/40 pointer-events-none z-10 animate-pulse border-2 border-red-500 box-border pointer-events-none" />
                      )}
                      {floodedTiles.some((f) => f.square === squareName) && (
                        <div className="absolute inset-0 bg-blue-500/40 pointer-events-none z-10 animate-pulse border-2 border-blue-400 box-border pointer-events-none" />
                      )}

                      {/* Coordinates */}
                      {colIndex === 0 && (
                        <span
                          className="absolute top-1 left-1.5 font-sans text-sm sm:text-base md:text-lg select-none text-[#ffffff] z-20 pointer-events-none"
                          style={{
                            textShadow:
                              "1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0px 2px 2px rgba(0,0,0,0.8)",
                          }}
                        >
                          {8 - rowIndex}
                        </span>
                      )}
                      {rowIndex === 7 && (
                        <span
                          className="absolute bottom-0 right-1.5 font-sans text-sm sm:text-base md:text-lg select-none text-[#ffffff] z-20 pointer-events-none"
                          style={{
                            textShadow:
                              "1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 0px 2px 2px rgba(0,0,0,0.8)",
                          }}
                        >
                          {String.fromCharCode(97 + colIndex)}
                        </span>
                      )}

                      {/* Skill Button Pop-out */}
                      {showSkillButton && (
                        <div className="absolute bottom-full mb-1 sm:mb-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-[100] animate-fade-in pointer-events-auto">
                          <button
                            disabled={!canActivateSkill}
                            className={`font-mono text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-2 border-2 border-[#2c241c] transition shadow-lg whitespace-nowrap ${canActivateSkill ? "bg-[#d4af37] text-black hover:bg-[#ffe37e]" : "bg-[#1a1410] text-[#a9a9a9] cursor-not-allowed opacity-95"}`}
                            style={
                              canActivateSkill
                                ? {
                                    boxShadow:
                                      "inset -1px -1px 0px rgba(0,0,0,0.5), inset 1px 1px 0px rgba(255,255,255,0.5), 2px 2px 0px rgba(0,0,0,0.5)",
                                  }
                                : { boxShadow: "2px 2px 0px rgba(0,0,0,0.5)" }
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (canActivateSkill) {
                                playButtonSfx();
                                if (piece.type === "q") {
                                  const lastQM =
                                    piece.color === "w"
                                      ? queenLastMoveW
                                      : queenLastMoveB;
                                  if (lastQM) {
                                    const newGame = new Chess(game.fen());
                                    const qPiece = newGame.get(squareName);
                                    newGame.remove(squareName);
                                    newGame.put(
                                      qPiece,
                                      lastQM.from as import("chess.js").Square,
                                    );

                                    if (piece.color === "w") {
                                      setQueenLastMoveW(null);
                                      setWhitePoints((p) => Math.max(0, p - 7));
                                    } else {
                                      setQueenLastMoveB(null);
                                      setBlackPoints((p) => Math.max(0, p - 7));
                                    }

                                    const tokens = newGame.fen().split(" ");
                                    tokens[1] = tokens[1] === "w" ? "b" : "w";
                                    tokens[2] = "-"; // clear castling rights upon teleport
                                    tokens[3] = "-";
                                    try { newGame.load(tokens.join(" ")); } catch(e) { console.error("Q skill load:", e); }

                                    setSelectedSquare(null);
                                    setPossibleMoves([]);
                                    setGame(newGame);
                                    setSkillUses((prev) => ({
                                      ...prev,
                                      [piece.color]: {
                                        ...prev[piece.color as "w" | "b"],
                                        q: prev[piece.color as "w" | "b"].q + 1,
                                      },
                                    }));
                                  }
                                } else if (piece.type === "r") {
                                  let kingSq: import("chess.js").Square | null =
                                    null;
                                  board.forEach((r, ri) =>
                                    r.forEach((p, fi) => {
                                      if (
                                        p &&
                                        p.type === "k" &&
                                        p.color === piece.color
                                      ) {
                                        kingSq = (String.fromCharCode(97 + fi) +
                                          (8 -
                                            ri)) as import("chess.js").Square;
                                      }
                                    }),
                                  );

                                  if (kingSq) {
                                    const newGame = new Chess(game.fen());
                                    const kPiece = newGame.get(kingSq);
                                    const rPiece = newGame.get(squareName);
                                    newGame.remove(kingSq);
                                    newGame.remove(squareName);
                                    newGame.put(rPiece, kingSq);
                                    newGame.put(kPiece, squareName);

                                    if (piece.color === "w")
                                      setWhitePoints((p) => Math.max(0, p - 7));
                                    else
                                      setBlackPoints((p) => Math.max(0, p - 7));

                                    const tokens = newGame.fen().split(" ");
                                    tokens[1] = tokens[1] === "w" ? "b" : "w";
                                    tokens[2] = "-"; // clear castling rights upon teleport
                                    tokens[3] = "-";
                                    try { newGame.load(tokens.join(" ")); } catch(e) { console.error("Q skill load:", e); }

                                    setSelectedSquare(null);
                                    setPossibleMoves([]);
                                    setGame(newGame);
                                    setSkillUses((prev) => ({
                                      ...prev,
                                      [piece.color]: {
                                        ...prev[piece.color as "w" | "b"],
                                        r: prev[piece.color as "w" | "b"].r + 1,
                                      },
                                    }));
                                  }
                                } else if (piece.type === "b") {
                                  if (piece.color === "w")
                                    setWhitePoints((p) => Math.max(0, p - 6));
                                  else
                                    setBlackPoints((p) => Math.max(0, p - 6));

                                  setPendingHolyLight(squareName);
                                  setSelectedSquare(null);
                                  setPossibleMoves([]);
                                  setSkillUses((prev) => ({
                                    ...prev,
                                    [piece.color]: {
                                      ...prev[piece.color as "w" | "b"],
                                      b: prev[piece.color as "w" | "b"].b + 1,
                                    },
                                  }));
                                } else if (piece.type === "n") {
                                  if (piece.color === "w")
                                    setWhitePoints((p) => Math.max(0, p - 6));
                                  else
                                    setBlackPoints((p) => Math.max(0, p - 6));

                                  setActiveKnightMomentum(squareName);
                                  setSelectedSquare(null);
                                  setPossibleMoves([]);
                                  setSkillUses((prev) => ({
                                    ...prev,
                                    [piece.color]: {
                                      ...prev[piece.color as "w" | "b"],
                                      n: prev[piece.color as "w" | "b"].n + 1,
                                    },
                                  }));
                                } else if (piece.type === "k") {
                                  // No point cost specified for King
                                  setIronWill({
                                    color: piece.color,
                                    turnsLeft: 15,
                                    capturesMade: 0,
                                  });
                                  setSelectedSquare(null);
                                  setPossibleMoves([]);
                                }
                              }
                            }}
                          >
                            ACTIVATE {piece?.type.toUpperCase()}
                          </button>
                          {!canActivateSkill && skillRequirementText && (
                            <div className="mt-1 font-mono text-[8px] bg-black/90 text-[#ff5555] px-1 py-0.5 rounded whitespace-nowrap border border-red-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                              {skillRequirementText}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          
          {/* Animating Piece Overlay */}
          {animMove && (
            <motion.div
              key={animMove.id}
              initial={{
                left: `${animMove.fromCol * 12.5}%`,
                top: `${animMove.fromRow * 12.5}%`,
              }}
              animate={{
                left: `${animMove.toCol * 12.5}%`,
                top: `${animMove.toRow * 12.5}%`,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onAnimationComplete={() => setAnimMove(null)}
              className="absolute w-[12.5%] h-[12.5%] z-50 flex items-center justify-center pointer-events-none"
            >
              {(() => {
                const pieceKey = `${animMove.color}_${animMove.piece}`;
                const pieceImage = pieceImages ? pieceImages[pieceKey] : undefined;
                const showImage = pieceImage && !imageErrors[pieceKey];
                
                if (showImage) {
                  return (
                    <img key="img" src={pieceImage} className="w-[80%] h-[80%] object-contain drop-shadow-lg pixelated" style={{ imageRendering: "pixelated" }} />
                  );
                } else {
                  return (
                    <span key="span" className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg" style={
                      animMove.color === "w"
                      ? {
                          color: "#ffffff",
                          WebkitTextStroke: "2px #222222",
                          textShadow: "0 4px 6px rgba(0, 0, 0, 0.4)",
                        }
                      : {
                          color: "#222222",
                          WebkitTextStroke: "1px #ffffff",
                          textShadow: "0 4px 6px rgba(0, 0, 0, 0.6)",
                        }
                    }>
                      {PIECES[animMove.piece]}
                    </span>
                  );
                }
              })()}
            </motion.div>
          )}
        </div>

        {/* White Player Info (BOTTOM) */}
        <div
          className={`mt-2 w-full max-w-[384px] sm:max-w-[512px] md:max-w-[640px] flex justify-between items-center bg-[#2c241c] p-2 sm:p-4 border-4 ${game.turn() === "w" ? "border-[#d4af37]" : "border-[#1a1410]"} font-mono text-[10px] sm:text-sm relative z-10 transition-colors duration-300`}
          style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.5)" }}
        >
          <div className="text-[#d1c8b8] flex items-center gap-2 sm:gap-3 tracking-widest font-bold">
            <div
              className={`w-3 h-3 sm:w-4 sm:h-4 border-2 border-black bg-[#d1c8b8]`}
            ></div>
            <span className="hidden sm:inline">
              WHITE ({whiteFaction.toUpperCase()})
            </span>
            <span className="sm:hidden">
              WHT ({whiteFaction.toUpperCase()})
            </span>
          </div>
          <div
            className={`text-sm sm:text-xl font-bold ${game.turn() === "w" ? "text-[#d4af37]" : "text-[#d1c8b8]"}`}
          >
            PTS: {whitePoints} | {formatTime(whiteTime)}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-[640px] xl:w-80 flex-shrink-0 relative z-10 gap-4 mt-8 xl:mt-0">
        <div
          className="bg-[#2c241c] border-4 border-[#4a3f35] p-4 text-center font-mono relative z-10"
          style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
        >
          <h3
            className="text-xl text-[#d4af37] mb-2 font-bold drop-shadow-md"
            style={{ textShadow: "1px 1px 0px #000" }}
          >
            🎲 DICE OF FATE
          </h3>
          <div className="flex flex-col justify-between text-[#d1c8b8] text-xs sm:text-sm gap-2">
            <div className="flex justify-between items-center bg-[#1a1410] px-2 py-1 border border-[#3d3227]">
              <span>WHITE ROLLS LEFT:</span>
              <span className="font-bold text-[#d4af37]">
                {Math.max(
                  0,
                  2 + Math.floor(Math.ceil(moveCount / 2) / 7) - whiteDiceRolls,
                )}
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#1a1410] px-2 py-1 border border-[#3d3227]">
              <span>BLACK ROLLS LEFT:</span>
              <span className="font-bold text-[#d4af37]">
                {Math.max(
                  0,
                  2 +
                    Math.floor(Math.floor(moveCount / 2) / 7) -
                    blackDiceRolls,
                )}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (!selectedSquare) {
                setDiceRollResult({
                  player: game.turn() as "w" | "b",
                  dice: 0,
                  msg: "Error: Please select one of your pieces on the board first, then roll!",
                });
                setTimeout(() => setDiceRollResult(null), 3000);
                return;
              }
              const piece = game.get(selectedSquare);
              if (!piece || piece.color !== game.turn()) {
                setDiceRollResult({
                  player: game.turn() as "w" | "b",
                  dice: 0,
                  msg: "Error: Please select one of your OWN pieces on the board first, then roll!",
                });
                setTimeout(() => setDiceRollResult(null), 3000);
                return;
              }
              if (diceGlowPiece && diceGlowPiece.square === selectedSquare) {
                setDiceRollResult({
                  player: game.turn() as "w" | "b",
                  dice: 0,
                  msg: "Error: You cannot use the Dice of Fate on a piece that is already under the Royal Guard effect!",
                });
                setTimeout(() => setDiceRollResult(null), 3000);
                return;
              }

              const player = game.turn() as "w" | "b";
              const whiteMaxRolls =
                2 + Math.floor(Math.ceil(moveCount / 2) / 7);
              const blackMaxRolls =
                2 + Math.floor(Math.floor(moveCount / 2) / 7);
              if (player === "w" && whiteDiceRolls >= whiteMaxRolls) return;
              if (player === "b" && blackDiceRolls >= blackMaxRolls) return;

              setIsRollingDice(true);
              setDiceRollResult(null);

              let frames = 0;
              const interval = setInterval(() => {
                setRollingDiceValue(Math.floor(Math.random() * 6) + 1);
                frames++;
                if (frames > 15) {
                  clearInterval(interval);
                  setIsRollingDice(false);

                  let roll = Math.floor(Math.random() * 6) + 1;
                  let { newGame, actualMsg, finalSquare } = executeDiceOfFate(roll, player as "w"|"b", selectedSquare as import("chess.js").Square);
                  setGame(newGame);

                  if (player === "w") {
                    setWhiteDiceRolls((prev) => prev + 1);
                  } else {
                    setBlackDiceRolls((prev) => prev + 1);
                  }
                  setDiceRollResult({ player, dice: roll, msg: actualMsg });
                  if (roll === 2) {
                    setDiceGlowPiece({
                      square: finalSquare,
                      turnsLeft: 2,
                      color: player,
                    });
                  }
                  setSelectedSquare(null);
                  setPossibleMoves([]);
                  setTimeout(() => setDiceRollResult(null), 3000);
                }
              }, 100);
            }}
            disabled={
              isRollingDice ||
              (gameMode === "pve" && game.turn() !== playerSide) ||
              !selectedSquare ||
              (selectedSquare &&
                game.get(selectedSquare)?.color !== game.turn()) ||
              (selectedSquare &&
                diceGlowPiece &&
                diceGlowPiece.square === selectedSquare) ||
              (game.turn() === "w" &&
                whiteDiceRolls >=
                  2 + Math.floor(Math.ceil(moveCount / 2) / 7)) ||
              (game.turn() === "b" &&
                blackDiceRolls >=
                  2 + Math.floor(Math.floor(moveCount / 2) / 7)) ||
              checkIsGameOver() ||
              (ironWill !== null && ironWill.turnsLeft === 0)
            }
            className="mt-4 w-full py-2 bg-[#4a3f35] text-[#d1c8b8] border-2 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition disabled:opacity-50"
          >
            {isRollingDice
              ? `ROLLING DICE...`
              : !selectedSquare ||
                  (selectedSquare &&
                    game.get(selectedSquare)?.color !== game.turn())
                ? "SELECT YOUR PIECE"
                : "ROLL DICE"}
          </button>

          {(isRollingDice || diceRollResult) && (
            <div className="mt-4 flex justify-center py-4 text-[#d4af37]">
              <div
                className={`text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] ${isRollingDice ? "animate-[spin_0.2s_linear_infinite]" : "animate-bounce"}`}
              >
                {isRollingDice
                  ? ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][rollingDiceValue - 1] || "🎲"
                  : diceRollResult
                    ? ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][diceRollResult.dice - 1] ||
                      "🎲"
                    : "🎲"}
              </div>
            </div>
          )}

          {diceRollResult && !isRollingDice && (
            <div className="mt-4 p-2 bg-[#1a1410] border-2 border-[#d4af37] text-left animate-fade-in">
              <div className="text-sm text-[#ffcccb] font-bold">
                {diceRollResult.player === "w" ? "WHITE" : "BLACK"} ROLLED A{" "}
                {diceRollResult.dice}!
              </div>
              <div className="text-xs text-[#d1c8b8] mt-1 leading-relaxed">
                {diceRollResult.msg}
              </div>
            </div>
          )}
        </div>

        {/* Movement History */}
        <div
          className="bg-[#2c241c] border-4 border-[#4a3f35] p-4 font-mono relative z-10"
          style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
        >
          <h3
            className="text-xl text-[#d4af37] mb-2 font-bold drop-shadow-md text-center"
            style={{ textShadow: "1px 1px 0px #000" }}
          >
            📜 HISTORY
          </h3>
          <div className="flex flex-col gap-1 text-[#d1c8b8] text-[10px] sm:text-xs w-full pr-1">
            {(() => {
              const history = customHistory;
              const displayed = history.slice(-4).reverse();
              const emptySlots = Math.max(0, 4 - displayed.length);
              const pieceNames: Record<string, string> = {
                p: "PAWN",
                n: "KNIGHT",
                b: "BISHOP",
                r: "ROOK",
                q: "QUEEN",
                k: "KING",
              };

              return (
                <>
                  {displayed.map((m, idx) => {
                    const moveNum = history.length - idx;
                    return (
                      <div
                        key={moveNum}
                        className="flex justify-between items-center bg-[#1a1410] px-2 py-1.5 border-b border-[#3d3227] h-8"
                      >
                        <span className="font-bold text-[#d4af37] opacity-80 w-6">
                          {moveNum}.
                        </span>
                        <span
                          className={
                            m.color === "w"
                              ? "text-white font-bold"
                              : "text-gray-400 font-bold"
                          }
                        >
                          {m.color === "w" ? "WHT" : "BLK"}
                        </span>
                        <span className="flex-1 text-right font-bold text-xs tracking-wider">
                          {pieceNames[m.piece] ||
                            (m.piece ? m.piece.toUpperCase() : "PIECE")}{" "}
                          {m.from} → {m.to} {m.captured ? "⚔️" : ""}
                        </span>
                      </div>
                    );
                  })}
                  {Array.from({ length: emptySlots }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="flex justify-between items-center bg-[#1a1410]/40 px-2 py-1.5 border-b border-[#3d3227]/30 h-8 italic opacity-30"
                    >
                      <span className="font-bold text-[#d4af37] w-6">-</span>
                      <span>---</span>
                      <span className="flex-1 text-right">
                        Awaiting Move...
                      </span>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </div>
      {checkIsGameOver() ||
      whiteTime === 0 ||
      blackTime === 0 ||
      chaosWinner ||
      eventWinner ||
      (ironWill && ironWill.turnsLeft === 0) ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
          <div
            className="bg-[#2c241c] border-4 border-[#4a3f35] p-8 text-center animate-fade-in"
            style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
          >
            <div
              className="text-4xl sm:text-5xl font-mono text-[#d4af37] drop-shadow-[0_2px_2px_rgba(0,0,0,1)] mb-6"
              style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
            >
              BATTLE OVER
            </div>
            <div className="text-2xl sm:text-3xl font-mono text-[#d1c8b8] drop-shadow-md mb-8">
              {chaosWinner
                ? chaosWinner === "TIE"
                  ? "A TIE (CHAOS)"
                  : `${chaosWinner} VICTORIOUS`
                : eventWinner
                  ? eventWinner === "TIE"
                    ? "A TIE (MUTUAL KING ELIMINATION)"
                    : `${eventWinner} VICTORIOUS`
                  : checkIsCheckmate()
                    ? `${game.turn() === "w" ? blackFaction.toUpperCase() : whiteFaction.toUpperCase()} VICTORIOUS`
                    : capturedWhite.includes("k") && capturedBlack.includes("k")
                      ? "A TIE (MUTUAL DESTRUCTION)"
                      : capturedWhite.includes("k")
                        ? `${blackFaction.toUpperCase()} VICTORIOUS`
                        : capturedBlack.includes("k")
                          ? `${whiteFaction.toUpperCase()} VICTORIOUS`
                    : whiteTime === 0
                      ? `${blackFaction.toUpperCase()} VICTORIOUS (TIME)`
                      : blackTime === 0
                        ? `${whiteFaction.toUpperCase()} VICTORIOUS (TIME)`
                        : ironWill && ironWill.turnsLeft === 0
                          ? "A STALEMATE (IRON WILL TIE)"
                          : "A STALEMATE"}
            </div>
            <button
              onClick={() => {
                playButtonSfx();
                setGame(new Chess());
                setSelectedSquare(null);
                setPossibleMoves([]);
                setWhiteTime(INITIAL_TIME);
                setBlackTime(INITIAL_TIME);
                setIsMenuOpen(false);
                setGameStarted(false);
                setCapturedWhite([]);
                setCapturedBlack([]);
                setLavaTiles([]);
                setFloodedTiles([]);
                setChaosMode(null);
                setChaosWinner(null);
                setEventWinner(null);
                setMoveCount(0);
                setCustomHistory([]);
                setWhiteDiceRolls(0);
                setBlackDiceRolls(0);
                setDiceRollResult(null);
                setEventTiles([]);
                setActiveEvent(null);
                setIronWill(null);
                setQueenLastMoveW(null);
                setQueenLastMoveB(null);
                setHolyLightPiece(null);
                setPendingHolyLight(null);
                setActiveKnightMomentum(null);
                setPendingMomentumJump(null);
                setWhitePoints(0);
                setBlackPoints(0);
                setAiMoveQueued(null);
                setMenuStep("mode");
                setDiceGlowPiece(null);
                setPendingPromotion(null);
                setCaptureAnim(null);
                setSkillUses({
                  w: { q: 0, r: 0, b: 0, n: 0, k: 0 },
                  b: { q: 0, r: 0, b: 0, n: 0, k: 0 },
                });
              }}
              className="font-mono text-xl px-8 py-4 bg-[#8b2626] text-[#ffcccb] border-4 border-[#4a1111] hover:bg-[#a63030] transition shadow-lg"
              style={{
                boxShadow:
                  "inset -4px -4px 0px rgba(0,0,0,0.5), inset 4px 4px 0px rgba(255,255,255,0.2)",
              }}
            >
              RETURN TO MAIN MENU PAGE
            </button>
          </div>
        </div>
      ) : null}

      {isMenuOpen &&
        !checkIsGameOver() &&
        whiteTime > 0 &&
        blackTime > 0 &&
        !chaosWinner &&
        !eventWinner &&
        (!ironWill || ironWill.turnsLeft > 0) && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4"
            style={{
              filter: `brightness(${100 / brightness})` /* Counteract the root brightness to keep menu clearly visible */,
            }}
          >
            <div
              className="bg-[#2c241c] border-4 border-[#4a3f35] p-8 text-center animate-fade-in flex flex-col gap-4 w-80 max-w-[90vw]"
              style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
            >
              {!isSettingsOpen ? (
                <>
                  <h2
                    className="text-2xl sm:text-3xl font-mono text-[#d4af37] mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
                    style={{
                      textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000",
                    }}
                  >
                    PAUSED
                  </h2>

                  <button
                    onClick={() => {
                      playButtonSfx();
                      setIsMenuOpen(false);
                    }}
                    className="font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg"
                    style={{
                      boxShadow:
                        "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
                    }}
                  >
                    RESUME GAME
                  </button>
                  <button
                    onClick={() => {
                      playButtonSfx();
                      setIsSettingsOpen(true);
                    }}
                    className="font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg"
                    style={{
                      boxShadow:
                        "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
                    }}
                  >
                    SETTINGS
                  </button>
                  <button
                    onClick={() => {
                      playButtonSfx();
                      setIsAbilitiesGuideOpen(true);
                    }}
                    className="font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg"
                    style={{
                      boxShadow:
                        "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
                    }}
                  >
                    ABILITIES
                  </button>
                </>
              ) : (
                <>
                  <h2
                    className="text-2xl sm:text-3xl font-mono text-[#d4af37] mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
                    style={{
                      textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000",
                    }}
                  >
                    SETTINGS
                  </h2>

                  <div className="flex flex-col gap-6 text-left mb-6">
                    {/* View Mode */}
                    <div>
                      <div className="text-[#d1c8b8] font-mono mb-2 text-sm">
                        VIEW MODE
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            playButtonSfx();
                            if (
                              document.fullscreenElement &&
                              document.exitFullscreen
                            ) {
                              document.exitFullscreen();
                            }
                          }}
                          className={`flex-1 font-mono text-sm py-2 px-2 border-2 transition-colors ${!isFullscreen ? "bg-[#5c4f42] border-[#d4af37] text-white" : "bg-[#2c241c] border-[#3d3227] text-[#807662] hover:border-[#5c4f42]"}`}
                        >
                          WINDOWED
                        </button>
                        <button
                          onClick={() => {
                            playButtonSfx();
                            if (!document.fullscreenElement) {
                              document.documentElement
                                .requestFullscreen()
                                .catch(() => {});
                            }
                          }}
                          className={`flex-1 font-mono text-sm py-2 px-2 border-2 transition-colors ${isFullscreen ? "bg-[#5c4f42] border-[#d4af37] text-white" : "bg-[#2c241c] border-[#3d3227] text-[#807662] hover:border-[#5c4f42]"}`}
                        >
                          FULL SCREEN
                        </button>
                      </div>
                    </div>

                    {/* Brightness */}
                    <div>
                      <div className="text-[#d1c8b8] font-mono mb-2 text-sm flex justify-between">
                        <span>BRIGHTNESS</span>
                        <span>{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={brightness}
                        onChange={(e) =>
                          setBrightness(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Volume */}
                    <div>
                      <div className="text-[#d1c8b8] font-mono mb-2 text-sm flex justify-between">
                        <span>MASTER VOLUME</span>
                        <span>{masterVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={masterVolume}
                        onChange={(e) =>
                          setMasterVolume(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playButtonSfx();
                      setIsSettingsOpen(false);
                    }}
                    className="font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d1c8b8] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg mt-auto"
                    style={{
                      boxShadow:
                        "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
                    }}
                  >
                    RETURN
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      {pendingPromotion && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/80 z-[200] p-4"
          style={{ filter: `brightness(${100 / brightness})` }}
        >
          <div
            className="bg-[#2c241c] border-4 border-[#4a3f35] p-6 text-center animate-fade-in flex flex-col gap-4 w-80 max-w-[90vw]"
            style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
          >
            <h2
              className="text-2xl sm:text-3xl font-mono text-[#d4af37] mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
              style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
            >
              PROMOTE PAWN
            </h2>
            <div className="text-[#d1c8b8] font-mono text-sm mb-4">
              AVAILABLE POINTS:{" "}
              {game.turn() === "w" ? whitePoints : blackPoints}
            </div>

            <div className="flex flex-col gap-3">
              {[
                { type: "q", name: "Queen", cost: 10 },
                { type: "r", name: "Rook", cost: 7 },
                { type: "b", name: "Bishop", cost: 3 },
                { type: "n", name: "Knight", cost: 3 },
              ].map((opt) => {
                const currentPoints =
                  game.turn() === "w" ? whitePoints : blackPoints;
                const canAfford = currentPoints >= opt.cost;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      playButtonSfx();
                      handlePromotion(opt.type, opt.cost);
                    }}
                    disabled={!canAfford}
                    className={`font-mono text-lg px-4 py-3 border-2 transition-colors flex justify-between ${canAfford ? "bg-[#4a3f35] text-[#d1c8b8] border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] shadow-lg" : "bg-[#1a1410] text-[#555] border-[#1a1410] cursor-not-allowed"}`}
                    style={
                      canAfford
                        ? {
                            boxShadow:
                              "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
                          }
                        : {}
                    }
                  >
                    <span>{opt.name.toUpperCase()}</span>
                    <span>{opt.cost} PTS</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                playButtonSfx();
                setPendingPromotion(null);
                setSelectedSquare(null);
                setPossibleMoves([]);
              }}
              className="font-mono text-xl px-4 py-3 bg-[#8b2626] text-[#ffcccb] border-4 border-[#4a1111] hover:bg-[#a63030] transition shadow-lg mt-4"
              style={{
                boxShadow:
                  "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.2)",
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {activeEvent && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/80 z-[250] p-4"
          style={{ filter: `brightness(${100 / brightness})` }}
        >
          <div
            className="bg-[#2c241c] border-4 border-[#4a3f35] p-6 text-center animate-fade-in flex flex-col gap-4 w-80 sm:w-96 max-w-[90vw]"
            style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
          >
            <h2
              className="text-2xl sm:text-3xl font-mono text-[#d4af37] mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
              style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
            >
              <span>⚡ MYSTERY EVENT</span>
            </h2>

            <div className="bg-[#1a1410] p-4 border-2 border-[#4a3f35] flex flex-col gap-2 relative">
              <div className="text-xl font-mono text-[#ffcccb] font-bold tracking-widest uppercase">
                {activeEvent.type}
              </div>

              <div className="text-[#d1c8b8] font-mono text-xs sm:text-sm mt-2 leading-relaxed">
                {activeEvent.type === "Necromancer Circle" &&
                  "Captured enemy pieces return to the game randomized!"}
                {activeEvent.type === "Holy Sanctuary" &&
                  "Allied captured pieces are immediately placed on the board!"}
                {activeEvent.type === "Lava Crack" &&
                  `The tile ${activeEvent.square.toUpperCase()} becomes dangerously hot! Pieces ending their turn here will be destroyed for 3 turns.`}
                {activeEvent.type === "Flooded Tiles" &&
                  `The tile ${activeEvent.square.toUpperCase()} is flooded and blocked for 2 turns.`}
                {activeEvent.type === "Portal Rift" &&
                  "Your piece is teleported to a random tile!"}
                {activeEvent.type === "Final Eclipse" &&
                  "The board enters CHAOS MODE! 5 turns each. 1 Minute remaining. Whoever has more pieces wins!"}
                {activeEvent.type === "Ancient Dragon" &&
                  "An Ancient Dragon attacks a random 2x2 section of the board, destroying all pieces within!"}
              </div>
            </div>

            <button
              onClick={() => {
                playButtonSfx();
                handleEventContinue();
              }}
              className="font-mono text-xl px-4 py-3 bg-[#4a3f35] text-[#d4af37] border-4 border-[#2c241c] hover:bg-[#5c4f42] hover:border-[#3d3227] transition shadow-lg mt-4 animate-pulse hover:animate-none"
              style={{
                boxShadow:
                  "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.1)",
              }}
            >
              ACCEPT FATE
            </button>
          </div>
        </div>
      )}

      {isAbilitiesGuideOpen && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/80 z-[300] p-4"
          style={{ filter: `brightness(${100 / brightness})` }}
        >
          <div
            className="bg-[#2c241c] border-4 border-[#4a3f35] p-6 text-center animate-fade-in flex flex-col gap-4 w-full md:w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "8px 8px 0px rgba(0,0,0,0.8)" }}
          >
            <h2
              className="text-2xl sm:text-3xl font-mono text-[#d4af37] drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
              style={{ textShadow: "2px 2px 0px #5e3b12, 4px 4px 0px #000" }}
            >
              PIECE ABILITIES
            </h2>

            <div className="flex flex-col gap-3 font-mono text-xs sm:text-sm text-left mt-2 px-1">
              <div className="bg-[#1a1410] p-3 border border-[#3d3227]">
                <strong className="text-[#d4af37] text-base">
                  KING (Iron Will) - FREE:
                </strong>
                <p className="text-[#d1c8b8] mt-1 text-xs">
                  When the King is entirely alone, activate to prevent game over
                  and stall for survival for 15 turns (MAX 3 CAPTURES).
                </p>
              </div>
              <div className="bg-[#1a1410] p-3 border border-[#3d3227]">
                <strong className="text-[#d4af37] text-base">
                  QUEEN (Time Recall) - COST: 7 PTS:
                </strong>
                <p className="text-[#d1c8b8] mt-1 text-xs">
                  If the Queen has just moved and not captured a piece, she can
                  instantly jump back to her previous tile.
                </p>
              </div>
              <div className="bg-[#1a1410] p-3 border border-[#3d3227]">
                <strong className="text-[#d4af37] text-base">
                  ROOK (Castling Swap) - COST: 7 PTS:
                </strong>
                <p className="text-[#d1c8b8] mt-1 text-xs">
                  A special rapid maneuver that instantly swaps places with the
                  King safely, ignoring check state constraints.
                </p>
              </div>
              <div className="bg-[#1a1410] p-3 border border-[#3d3227]">
                <strong className="text-[#d4af37] text-base">
                  BISHOP (Holy Light) - COST: 6 PTS:
                </strong>
                <p className="text-[#d1c8b8] mt-1 text-xs">
                  Bless an allied piece and make it immune to captures for 2
                  full turns.
                </p>
              </div>
              <div className="bg-[#1a1410] p-3 border border-[#3d3227]">
                <strong className="text-[#d4af37] text-base">
                  KNIGHT (Momentum Jump) - COST: 6 PTS:
                </strong>
                <p className="text-[#d1c8b8] mt-1 text-xs">
                  After moving normally, the Knight readies momentum allowing it
                  to instantly hop onto any adjacent empty tile.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playButtonSfx();
                setIsAbilitiesGuideOpen(false);
              }}
              className="mt-4 font-mono text-xl px-4 py-3 bg-[#8b2626] text-[#ffcccb] border-4 border-[#4a1111] hover:bg-[#a63030] transition shadow-lg"
              style={{
                boxShadow:
                  "inset -2px -2px 0px rgba(0,0,0,0.5), inset 2px 2px 0px rgba(255,255,255,0.2)",
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
