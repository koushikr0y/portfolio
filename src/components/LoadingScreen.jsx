import { useState, useEffect } from "react";
import { Gamepad2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// --- Loading Screen Component ---
// Flavor text specifically for game dev portfolio
const LOADING_TEXTS = [
  "Loading Assets...",
  "Compiling Shaders...",
  "Generating Terrain...",
  "Spawning Mobs...",
  "Polishing Pixels...",
  "Calibrating Physics...",
  "Readying Player One...",
];

const LoadingScreen = ({ onComplete }) => {
  const { theme, currentTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Initializing World...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 20; // Slightly faster but random increments
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small delay at 100% before clearing
          return 100;
        }
        // Change text occasionally
        if (Math.random() > 0.8) {
          setText(LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)]);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]); // Add dependency for safety

  return (
    // Updated styling to match "Paper Pop" aesthetic (Cream background, dashed borders)
    <div
      className={`fixed inset-0 ${currentTheme.bg} z-[9999] flex flex-col items-center justify-center p-4`}
    >
      {/* Background Grid Pattern specifically for loading screen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${theme === "light" ? "#1A1A1A" : "#FFF"} 1px, transparent 1px), linear-gradient(90deg, ${theme === "light" ? "#1A1A1A" : "#FFF"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="w-full max-w-sm relative z-10 text-center">
        {/* Animated Icon */}
        <div className="mb-8 animate-bounce">
          <Gamepad2 size={64} className="mx-auto text-[#FF9F1C]" strokeWidth={1.5} />
        </div>

        <div
          className={`mb-2 flex justify-between text-xs font-black tracking-widest ${currentTheme.text} uppercase font-mono`}
        >
          <span>{text}</span>
          <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>

        {/* Progress Bar Container - Dashed Border Style */}
        <div
          className={`h-8 ${currentTheme.cardBg} rounded-xl border-4 border-dashed ${theme === "light" ? "border-[#1A1A1A]" : "border-gray-500"} overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(26,26,26,0.1)]`}
        >
          {/* Progress Fill - Striped Pattern */}
          <div
            className="h-full bg-[#FF9F1C] transition-all duration-100 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Stripes */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(45deg,rgba(255,255,255,.25) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.25) 50%,rgba(255,255,255,.25) 75%,transparent 75%,transparent)",
                backgroundSize: "1rem 1rem",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
