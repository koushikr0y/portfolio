import { useEffect, useState, useRef } from "react";
import { Gamepad2, Sparkles, Cpu, Radio, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LOADING_STEPS = [
  { label: "Initializing Game Engine...", icon: Cpu, color: "#2EC4B6" },
  { label: "Compiling Shader Graph & VFX...", icon: Sparkles, color: "#FF9F1C" },
  { label: "Syncing Multiplayer Nodes...", icon: Radio, color: "#F15BB5" },
  { label: "Ready to Launch", icon: ShieldCheck, color: "#4ade80" },
];

const LoadingScreen = ({ onComplete }) => {
  const { currentTheme, theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();
    const DURATION = 1800; // Fast 1.8 second loading

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(Math.floor(pct));

      // Update step index based on progress
      if (pct < 30) setCurrentStepIndex(0);
      else if (pct < 65) setCurrentStepIndex(1);
      else if (pct < 95) setCurrentStepIndex(2);
      else setCurrentStepIndex(3);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setFadeOut(true), 250);
        setTimeout(() => onComplete?.(), 600);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const activeStep = LOADING_STEPS[currentStepIndex];
  const StepIcon = activeStep.icon;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden
        ${theme === "dark" ? "bg-[#0A0A0F]" : "bg-[#F8F9FA]"} transition-opacity duration-500`}
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2EC4B6]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#F15BB5]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Glass Center Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        
        {/* Animated Avatar Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2EC4B6]/20 to-[#F15BB5]/20 border-4 border-dashed border-[#FF9F1C] p-1.5 shadow-[0_0_25px_rgba(255,159,28,0.3)] flex items-center justify-center relative overflow-hidden group">
            <div className="w-full h-full bg-[#FFE5D9] rounded-full overflow-hidden relative flex items-center justify-center">
              <img
                src="https://api.dicebear.com/9.x/notionists/svg?seed=Riley"
                alt="Koushik Roy Avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
          {/* Decorative Sparkle */}
          <Sparkles size={20} className="absolute -top-1 -right-1 text-[#FF9F1C] animate-bounce" />
        </div>

        {/* Title & Role Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-black ${currentTheme.text} uppercase tracking-tight`}>
            Koushik Roy
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-[#F15BB5] mt-1">
            Game Developer & Systems Architect
          </p>
        </div>

        {/* Smooth Loader Container */}
        <div className="w-full space-y-3">
          {/* Status Label & Percentage */}
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2" style={{ color: activeStep.color }}>
              <StepIcon size={15} className="animate-spin-slow" />
              <span>{activeStep.label}</span>
            </div>
            <span className={`font-mono font-black ${currentTheme.text}`}>{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className={`h-3 w-full rounded-full border-2 border-[#1A1A1A] dark:border-white/20 ${currentTheme.inputBg} overflow-hidden relative shadow-[2px_2px_0px_0px_#1A1A1A]`}>
            <div
              className="h-full bg-gradient-to-r from-[#2EC4B6] via-[#FF9F1C] to-[#F15BB5] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
