import { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

const BOOT_LINES = [
  { text: "▶ INITIALIZING GAME ENGINE...",       delay: 0,    color: "#2EC4B6" },
  { text: "▶ LOADING ASSET BUNDLES...",           delay: 320,  color: "#9B5DE5" },
  { text: "▶ COMPILING SHADER PROGRAMS...",       delay: 640,  color: "#FF9F1C" },
  { text: "▶ CONNECTING TO PORTFOLIO API...",     delay: 960,  color: "#F15BB5" },
  { text: "▶ MOUNTING SCENE GRAPH...",            delay: 1280, color: "#2EC4B6" },
  { text: "▶ ALL SYSTEMS NOMINAL",               delay: 1600, color: "#4ade80" },
];

const PIXEL_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: [4, 6, 8][i % 3],
  color: ["#FF9F1C", "#2EC4B6", "#9B5DE5", "#F15BB5"][i % 4],
  dur: 2 + (i % 4) * 0.8,
  delay: (i * 0.18) % 3,
}));

const LoadingScreen = ({ onComplete }) => {
  const { currentTheme, theme } = useTheme();
  const [xp, setXp] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  // XP bar animation
  useEffect(() => {
    startRef.current = performance.now();
    const DURATION = 2400;

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setXp(Math.floor(eased * 100));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setXp(100);
        setDone(true);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Boot lines stagger in
  useEffect(() => {
    BOOT_LINES.forEach((line) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay + 200);
    });
  }, []);

  // Trigger fade-out and call onComplete
  useEffect(() => {
    if (!done) return;
    const t1 = setTimeout(() => setFadeOut(true), 500);
    const t2 = setTimeout(() => onComplete?.(), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [done, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden
        ${theme === "dark" ? "bg-[#0A0A0F]" : "bg-[#FFF9F0]"}`}
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-60 z-10" />

      {/* Grid background */}
      <div className={`absolute inset-0 pointer-events-none ${theme === "light" ? "bg-grid-light" : "bg-grid-dark"}`} />

      {/* Floating pixel particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PIXEL_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="pixel-particle"
            style={{
              left: `${p.x}%`,
              bottom: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              borderRadius: "2px",
            }}
          />
        ))}
      </div>

      {/* Corner decorations */}
      {[
        "top-4 left-4 border-t-4 border-l-4",
        "top-4 right-4 border-t-4 border-r-4",
        "bottom-4 left-4 border-b-4 border-l-4",
        "bottom-4 right-4 border-b-4 border-r-4",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-10 h-10 ${cls} border-[#FF9F1C] opacity-40 pointer-events-none`}
        />
      ))}

      {/* Main card */}
      <div
        className={`relative z-20 w-full max-w-md mx-4 ${currentTheme.cardBg}
          border-[3px] border-dashed ${COLORS.orange.border}
          rounded-2xl p-8`}
        style={{ boxShadow: "10px 10px 0px 0px rgba(255,159,28,0.25)" }}
      >
        {/* Game logo / title */}
        <div className="text-center mb-8">
          <div
            className={`text-[10px] font-bold tracking-[0.35em] uppercase ${COLORS.teal.text} mb-2 animate-flicker`}
          >
            ◆ PORTFOLIO OS v2.0 ◆
          </div>
          <h1
            className={`text-5xl font-black ${currentTheme.text} tracking-tighter`}
            style={{ textShadow: "4px 4px 0px #FF9F1C" }}
          >
            KOUSHIK
          </h1>
          <h2
            className={`text-2xl font-black ${COLORS.pink.text} tracking-tight -mt-1`}
          >
            ROY
          </h2>
          <div className={`text-xs font-bold tracking-widest ${currentTheme.textMuted} mt-2 uppercase`}>
            Game Developer · Level 24
          </div>
        </div>

        {/* Boot log */}
        <div
          className={`${currentTheme.inputBg} rounded-xl border-2 border-dashed ${currentTheme.inputBorder}
            p-4 mb-6 h-[148px] overflow-hidden font-mono text-xs`}
        >
          {visibleLines.map((line, i) => (
            <div
              key={i}
              className="leading-6"
              style={{
                color: line.color,
                animation: "slide-left 0.25s ease both",
                animationDelay: "0ms",
              }}
            >
              {line.text}
            </div>
          ))}
          {/* Blinking cursor */}
          {!done && (
            <span
              className="inline-block w-2 h-4 ml-1 align-middle"
              style={{
                background: "#2EC4B6",
                animation: "blink 0.7s step-end infinite",
              }}
            />
          )}
        </div>

        {/* XP load bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.textMuted}`}>
              Loading Assets
            </span>
            <span className={`text-sm font-black ${COLORS.orange.text}`}>{xp}%</span>
          </div>
          <div
            className={`h-5 w-full rounded-full overflow-hidden border-2 ${currentTheme.inputBorder} ${currentTheme.inputBg} relative`}
          >
            <div
              className={`h-full ${COLORS.orange.bg} relative shimmer-wrap`}
              style={{
                width: `${xp}%`,
                transition: "width 0.08s linear",
              }}
            >
              <div className="skill-bar-stripes absolute inset-0" />
            </div>
          </div>
        </div>

        {/* Press any key — only shows when complete */}
        <div
          className="text-center h-6"
          style={{
            opacity: done ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            className={`text-xs font-bold tracking-[0.2em] uppercase ${COLORS.teal.text}`}
            style={{ animation: done ? "blink 1s step-end infinite" : "none" }}
          >
            ▶ ENTERING WORLD...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
