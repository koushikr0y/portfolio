import { useState, useEffect, useRef } from "react";
import { X, Play, RotateCcw, Trophy, Sparkles, Gamepad2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { playClick, playOpen } from "../utils/soundFX";

export default function ArcadeGameModal({ onClose }) {
  const { currentTheme } = useTheme();
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("arcade_high_score") || "0", 10);
    }
    return 0;
  });

  const stateRef = useRef({
    player: { x: 160, y: 340, width: 32, height: 32, speed: 6 },
    bullets: [],
    asteroids: [],
    particles: [],
    keys: {},
    score: 0,
    gameOver: false,
    gameStarted: false,
  });

  const startGame = () => {
    try {
      playOpen();
    } catch (e) {}
    stateRef.current = {
      player: { x: 160, y: 340, width: 32, height: 32, speed: 6 },
      bullets: [],
      asteroids: [],
      particles: [],
      keys: {},
      score: 0,
      gameOver: false,
      gameStarted: true,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const handleKeyDown = (e) => {
      stateRef.current.keys[e.key] = true;
      if (e.key === " " && stateRef.current.gameStarted && !stateRef.current.gameOver) {
        stateRef.current.bullets.push({
          x: stateRef.current.player.x + 13,
          y: stateRef.current.player.y,
          vy: -9,
          width: 6,
          height: 12,
        });
        try {
          playClick();
        } catch (err) {}
      }
    };

    const handleKeyUp = (e) => {
      stateRef.current.keys[e.key] = false;
    };

    const handleTouchMove = (e) => {
      if (!stateRef.current.gameStarted || stateRef.current.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      stateRef.current.player.x = Math.max(0, Math.min(canvas.width - 32, touchX - 16));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationId;
    let spawnTimer = 0;

    const gameLoop = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0D0D15";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (state.gameStarted && !state.gameOver) {
        if (state.keys["ArrowLeft"] || state.keys["a"] || state.keys["A"]) {
          state.player.x = Math.max(0, state.player.x - state.player.speed);
        }
        if (state.keys["ArrowRight"] || state.keys["d"] || state.keys["D"]) {
          state.player.x = Math.min(canvas.width - state.player.width, state.player.x + state.player.speed);
        }

        spawnTimer++;
        if (spawnTimer % 35 === 0) {
          state.asteroids.push({
            x: Math.random() * (canvas.width - 28),
            y: -30,
            vy: 2.5 + Math.random() * 2.5,
            width: 28,
            height: 28,
            color: ["#FF9F1C", "#F15BB5", "#9B5DE5", "#2EC4B6"][Math.floor(Math.random() * 4)],
          });
        }

        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.y += b.vy;
          if (b.y < -10) {
            state.bullets.splice(i, 1);
            continue;
          }
          ctx.fillStyle = "#2EC4B6";
          ctx.fillRect(b.x, b.y, b.width, b.height);
        }

        for (let i = state.asteroids.length - 1; i >= 0; i--) {
          const a = state.asteroids[i];
          a.y += a.vy;

          if (
            state.player.x < a.x + a.width &&
            state.player.x + state.player.width > a.x &&
            state.player.y < a.y + a.height &&
            state.player.y + state.player.height > a.y
          ) {
            state.gameOver = true;
            setGameOver(true);
            try {
              playClick();
            } catch (err) {}
          }

          for (let j = state.bullets.length - 1; j >= 0; j--) {
            const b = state.bullets[j];
            if (
              b.x < a.x + a.width &&
              b.x + b.width > a.x &&
              b.y < a.y + a.height &&
              b.y + b.height > a.y
            ) {
              state.bullets.splice(j, 1);
              state.asteroids.splice(i, 1);
              state.score += 100;
              setScore(state.score);

              if (state.score > highScore) {
                setHighScore(state.score);
                if (typeof window !== "undefined") {
                  localStorage.setItem("arcade_high_score", state.score.toString());
                }
              }
              break;
            }
          }

          if (a.y > canvas.height + 30) {
            state.asteroids.splice(i, 1);
            continue;
          }

          ctx.fillStyle = a.color;
          ctx.fillRect(a.x, a.y, a.width, a.height);
        }

        ctx.fillStyle = "#FF9F1C";
        ctx.beginPath();
        ctx.moveTo(state.player.x + 16, state.player.y);
        ctx.lineTo(state.player.x, state.player.y + 32);
        ctx.lineTo(state.player.x + 32, state.player.y + 32);
        ctx.closePath();
        ctx.fill();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [highScore]);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#14141E] border-4 border-[#2EC4B6] rounded-3xl p-5 shadow-[0_0_40px_rgba(46,196,182,0.3)] flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#2EC4B6] font-black text-sm uppercase tracking-widest">
            <Gamepad2 size={20} /> Retro Arcade Demo
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="w-full flex items-center justify-between px-4 py-2 bg-black/50 rounded-xl border border-white/10 mb-3 text-xs font-black uppercase text-white">
          <span>SCORE: <strong className="text-[#FF9F1C] text-sm">{score}</strong></span>
          <span className="flex items-center gap-1"><Trophy size={14} className="text-[#FF9F1C]" /> BEST: {highScore}</span>
        </div>

        <div className="relative w-[340px] h-[380px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-inner">
          <canvas ref={canvasRef} width={340} height={380} className="w-full h-full block" />

          {!gameStarted && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
              <Sparkles size={40} className="text-[#2EC4B6] animate-pulse mb-3" />
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Space Defender</h2>
              <p className="text-xs text-white/70 mb-6 max-w-xs">
                Use <strong className="text-[#FF9F1C]">Left/Right Arrows</strong> (or drag on mobile) to move and <strong className="text-[#2EC4B6]">Spacebar</strong> to shoot!
              </p>
              <button
                onClick={startGame}
                className="bg-[#2EC4B6] hover:bg-[#20ab9d] text-black px-8 py-3 rounded-2xl font-black uppercase tracking-wider text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play size={18} fill="black" /> START GAME
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center animate-pop-in">
              <h2 className="text-3xl font-black text-red-500 uppercase tracking-widest mb-1">GAME OVER</h2>
              <p className="text-sm font-bold text-white mb-4">FINAL SCORE: <span className="text-[#FF9F1C]">{score}</span></p>
              <button
                onClick={startGame}
                className="bg-[#FF9F1C] hover:bg-[#e88c0c] text-black px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={16} /> REPLAY GAME
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-3">
          Tip: Touch & drag on mobile screens to dodge asteroids
        </p>
      </div>
    </div>
  );
}
