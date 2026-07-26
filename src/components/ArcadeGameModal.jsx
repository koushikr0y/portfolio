import { useState, useEffect } from "react";
import { X, Play, RotateCcw, Trophy, Shield, Zap, Coffee, Sword, Flame, Heart, Sparkles, Skull } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { playClick, playOpen } from "../utils/soundFX";

const BOSSES = [
  {
    id: "bug_lord",
    name: "NULL POINTER LORD",
    subtitle: "Level 40 Memory Corruptor",
    maxHp: 400,
    avatar: "👾",
    color: "#EF4444",
    xpReward: "+3,500 XP",
    attacks: [
      { name: "NullPointerException", minDmg: 12, maxDmg: 22, text: "corrupted your memory address!" },
      { name: "Stack Overflow",       minDmg: 18, maxDmg: 28, text: "overflowed your execution stack!" },
      { name: "Memory Leak",          minDmg: 8,  maxDmg: 16, text: "drained your system RAM!" },
    ],
  },
  {
    id: "deadline_dragon",
    name: "RELEASE DEADLINE DRAGON",
    subtitle: "Level 60 Final Boss",
    maxHp: 650,
    avatar: "🐉",
    color: "#FF9F1C",
    xpReward: "+7,000 XP",
    attacks: [
      { name: "Crunch Time Flame", minDmg: 16, maxDmg: 30, text: "unleashed 80-hour crunch time!" },
      { name: "Scope Creep",       minDmg: 14, maxDmg: 24, text: "added 10 unscheduled features!" },
      { name: "Merge Conflict",    minDmg: 20, maxDmg: 36, text: "destroyed your Git branch!" },
    ],
  },
];

export default function ArcadeGameModal({ onClose }) {
  const { currentTheme } = useTheme();
  const [currentBossIdx, setCurrentBossIdx] = useState(0);
  const boss = BOSSES[currentBossIdx];

  // Game States
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  // Player Stats
  const [playerHp, setPlayerHp] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [isShieldActive, setIsShieldActive] = useState(false);

  // Boss Stats
  const [bossHp, setBossHp] = useState(boss.maxHp);

  // Visual FX & Combat Log
  const [combatLog, setCombatLog] = useState([]);
  const [floatText, setFloatText] = useState(null); // { text, color, target: 'boss'|'player' }
  const [isBossAttacking, setIsBossAttacking] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("boss_raid_high_score") || "0", 10);
    }
    return 0;
  });

  const addLog = (msg) => {
    setCombatLog((prev) => [msg, ...prev.slice(0, 4)]);
  };

  const showFloatingText = (text, color, target) => {
    setFloatText({ text, color, target });
    setTimeout(() => setFloatText(null), 1000);
  };

  const startBattle = (bossIdx = 0) => {
    try { playOpen(); } catch (e) {}
    setCurrentBossIdx(bossIdx);
    const b = BOSSES[bossIdx];
    setPlayerHp(100);
    setPlayerEnergy(100);
    setIsShieldActive(false);
    setBossHp(b.maxHp);
    setCombatLog([`⚔️ Raid Battle Started! Defeat ${b.name}!`]);
    setGameOver(false);
    setVictory(false);
    setGameStarted(true);
  };

  // Boss Turn Counter-Attack
  const executeBossTurn = (currentHp) => {
    if (currentHp <= 0) return;
    setIsBossAttacking(true);

    setTimeout(() => {
      const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
      let rawDmg = Math.floor(Math.random() * (attack.maxDmg - attack.minDmg + 1)) + attack.minDmg;

      if (isShieldActive) {
        rawDmg = Math.floor(rawDmg * 0.3); // 70% damage reduction
        addLog(`🛡️ Refactor Shield reduced damage to ${rawDmg}!`);
        setIsShieldActive(false);
      }

      showFloatingText(`-${rawDmg} HP`, "#EF4444", "player");
      addLog(`👾 ${boss.name} used ${attack.name} for ${rawDmg} DMG!`);

      setPlayerHp((prevHp) => {
        const nextHp = Math.max(0, prevHp - rawDmg);
        if (nextHp <= 0) {
          setGameOver(true);
        }
        return nextHp;
      });

      // Regenerate player energy slightly each turn
      setPlayerEnergy((prev) => Math.min(100, prev + 20));
      setIsBossAttacking(false);
    }, 600);
  };

  // Player Actions
  const handlePlayerAction = (actionType) => {
    if (!gameStarted || gameOver || victory || isBossAttacking || playerHp <= 0) return;

    try { playClick(); } catch (e) {}

    if (actionType === "attack") {
      const dmg = Math.floor(Math.random() * 20) + 35; // 35-55 dmg
      showFloatingText(`-${dmg} HP`, "#FF9F1C", "boss");
      addLog(`⚔️ Code Strike hit ${boss.name} for ${dmg} DMG!`);

      const nextBossHp = Math.max(0, bossHp - dmg);
      setBossHp(nextBossHp);

      if (nextBossHp <= 0) {
        handleVictory();
      } else {
        executeBossTurn(nextBossHp);
      }
    } else if (actionType === "shield") {
      if (playerEnergy < 20) {
        addLog("⚠️ Not enough Energy for Shield!");
        return;
      }
      setPlayerEnergy((prev) => prev - 20);
      setIsShieldActive(true);
      showFloatingText("SHIELD UP!", "#2EC4B6", "player");
      addLog("🛡️ Refactor Shield activated! Next attack reduced by 70%.");
      executeBossTurn(bossHp);
    } else if (actionType === "heal") {
      if (playerEnergy < 30) {
        addLog("⚠️ Not enough Energy for Coffee Heal!");
        return;
      }
      setPlayerEnergy((prev) => prev - 30);
      const healAmt = 35;
      setPlayerHp((prev) => Math.min(100, prev + healAmt));
      showFloatingText(`+${healAmt} HP`, "#10B981", "player");
      addLog(`☕ Coffee Heal restored +${healAmt} HP!`);
      executeBossTurn(bossHp);
    } else if (actionType === "ultimate") {
      if (playerEnergy < 50) {
        addLog("⚠️ Need 50 Energy for Overclock!");
        return;
      }
      setPlayerEnergy((prev) => prev - 50);
      const dmg = Math.floor(Math.random() * 30) + 85; // 85-115 dmg
      showFloatingText(`CRITICAL! -${dmg}`, "#F15BB5", "boss");
      addLog(`⚡ CRITICAL OVERCLOCK smashed ${boss.name} for ${dmg} DMG!`);

      const nextBossHp = Math.max(0, bossHp - dmg);
      setBossHp(nextBossHp);

      if (nextBossHp <= 0) {
        handleVictory();
      } else {
        executeBossTurn(nextBossHp);
      }
    }
  };

  const handleVictory = () => {
    setVictory(true);
    const rewardScore = (currentBossIdx + 1) * 5000;
    addLog(`🎉 VICTORY! Boss Defeated! Earned ${boss.xpReward}!`);

    if (rewardScore > highScore) {
      setHighScore(rewardScore);
      if (typeof window !== "undefined") {
        localStorage.setItem("boss_raid_high_score", rewardScore.toString());
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#12121E] border-[3px] border-dashed border-[#FF9F1C] rounded-3xl p-5 shadow-[0_0_50px_rgba(255,159,28,0.25)] flex flex-col items-center select-none">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#FF9F1C] font-black text-sm uppercase tracking-widest">
            <Flame size={18} className="text-[#EF4444]" /> Boss Raid RPG
          </div>
          <button
            onClick={() => { playClick(); onClose(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Start Modal */}
        {!gameStarted && (
          <div className="w-full h-[390px] bg-[#0A0A12] border-2 border-white/15 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#FF9F1C] flex items-center justify-center mb-3 bg-[#FF9F1C]/10 animate-pulse text-3xl">
              👾
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">Dev Boss Raid</h2>
            <p className="text-xs text-white/70 mb-5 max-w-xs leading-relaxed">
              Use turn-based coding abilities to defeat corrupt boss bugs and claim XP rewards!
            </p>
            
            {/* Boss Select Buttons */}
            <div className="w-full space-y-2 mb-4">
              {BOSSES.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => startBattle(idx)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed
                    ${b.color === "#EF4444" ? "border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20" : "border-amber-500 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"}
                    transition-all cursor-pointer font-black text-xs uppercase tracking-wider`}
                >
                  <span className="flex items-center gap-2 text-sm">{b.avatar} {b.name}</span>
                  <span>{b.xpReward}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Battle Arena */}
        {gameStarted && (
          <div className="w-full flex flex-col items-center">
            
            {/* Boss Status Card */}
            <div className="w-full bg-[#181826] border border-white/15 rounded-2xl p-4 mb-3 relative overflow-hidden shadow-lg">
              {floatText && floatText.target === "boss" && (
                <div className="absolute top-2 right-4 font-black text-lg animate-bounce z-20" style={{ color: floatText.color }}>
                  {floatText.text}
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{boss.avatar}</span>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">{boss.name}</h3>
                    <p className="text-[10px] font-bold text-white/50">{boss.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#EF4444]">{bossHp} / {boss.maxHp} HP</span>
                </div>
              </div>
              {/* Boss Health Bar */}
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                  style={{ width: `${(bossHp / boss.maxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Player Status Bar */}
            <div className="w-full bg-[#181826] border border-white/15 rounded-2xl p-3.5 mb-3 relative shadow-lg">
              {floatText && floatText.target === "player" && (
                <div className="absolute top-2 right-4 font-black text-base animate-bounce z-20" style={{ color: floatText.color }}>
                  {floatText.text}
                </div>
              )}
              <div className="flex items-center justify-between mb-1.5 text-xs font-black">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Heart size={14} fill="#10B981" /> HP: {playerHp} / 100
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Zap size={14} fill="#2EC4B6" /> ENERGY: {playerEnergy} / 100
                </span>
              </div>
              {/* Player Health & Energy Bar */}
              <div className="grid grid-cols-2 gap-2">
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${playerHp}%` }} />
                </div>
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${playerEnergy}%` }} />
                </div>
              </div>
            </div>

            {/* Combat Log */}
            <div className="w-full h-20 bg-black/60 rounded-xl p-2.5 mb-3 border border-white/10 overflow-y-auto text-[11px] font-mono text-white/80 space-y-1">
              {combatLog.map((log, i) => (
                <div key={i} className="leading-tight">{log}</div>
              ))}
            </div>

            {/* Action Buttons Grid */}
            <div className="w-full grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePlayerAction("attack")}
                disabled={isBossAttacking || gameOver || victory}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FF9F1C] hover:bg-[#e88c0c] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sword size={16} /> Code Strike
              </button>

              <button
                onClick={() => handlePlayerAction("shield")}
                disabled={isBossAttacking || gameOver || victory || playerEnergy < 20}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#2EC4B6] hover:bg-[#20ab9d] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Shield size={16} /> Shield (-20 EN)
              </button>

              <button
                onClick={() => handlePlayerAction("heal")}
                disabled={isBossAttacking || gameOver || victory || playerEnergy < 30}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#10B981] hover:bg-[#0d9668] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Coffee size={16} /> Coffee Heal (-30 EN)
              </button>

              <button
                onClick={() => handlePlayerAction("ultimate")}
                disabled={isBossAttacking || gameOver || victory || playerEnergy < 50}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#F15BB5] hover:bg-[#d848a0] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={16} /> Overclock (-50 EN)
              </button>
            </div>
          </div>
        )}

        {/* Victory Overlay */}
        {victory && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="p-4 rounded-full bg-[#FF9F1C]/20 text-[#FF9F1C] mb-3 border border-[#FF9F1C]/40 animate-bounce">
              <Trophy size={40} />
            </div>
            <h2 className="text-2xl font-black text-[#FF9F1C] uppercase tracking-widest mb-1">RAID VICTORY!</h2>
            <p className="text-xs text-white/80 font-bold mb-2">Defeated {boss.name}</p>
            <div className="px-4 py-1.5 bg-[#2EC4B6]/20 border border-[#2EC4B6]/50 rounded-xl text-[#2EC4B6] text-sm font-black mb-5">
              LOOT EARNED: {boss.xpReward}
            </div>
            <button
              onClick={() => setGameStarted(false)}
              className="bg-[#2EC4B6] hover:bg-[#20ab9d] text-black px-7 py-3 rounded-2xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:scale-105 transition-all cursor-pointer"
            >
              CHOOSE NEXT BOSS
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="p-4 rounded-full bg-red-500/20 text-red-500 mb-3 border border-red-500/40">
              <Skull size={40} />
            </div>
            <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest mb-1">YOU WERE DEFEATED</h2>
            <p className="text-xs text-white/70 font-bold mb-5">{boss.name} overwhelmed your system memory.</p>
            <button
              onClick={() => startBattle(currentBossIdx)}
              className="bg-[#FF9F1C] hover:bg-[#e88c0c] text-black px-7 py-3 rounded-2xl font-black uppercase tracking-wider text-xs border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} /> REPLAY RAID
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
