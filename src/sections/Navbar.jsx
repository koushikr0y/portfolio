import { useState, useEffect } from "react";
import { Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { playClick, playHover, isSoundEnabled, setSoundEnabled } from "../utils/soundFX";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleTheme = () => {
    playClick();
    setSpinning(true);
    toggleTheme();
    setTimeout(() => setSpinning(false), 500);
  };

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(() => playClick(), 50);
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 sm:p-6 z-50 flex items-center gap-3">
      {/* Backdrop blur pill on scroll */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-400 pointer-events-none ${scrolled ? "backdrop-blur-sm bg-black/5" : ""
          }`}
      />

      {/* Sound FX Toggle Button */}
      <button
        onClick={handleToggleSound}
        onMouseEnter={playHover}
        title={soundOn ? "Mute Retro Audio" : "Unmute Retro Audio"}
        className={`relative p-3 rounded-full border-2 border-dashed transition-all duration-300
          hover:scale-110 active:scale-95
          ${theme === "light"
            ? "bg-white border-[#2EC4B6] text-[#2EC4B6] hover:bg-[#FFF9F0]"
            : "bg-[#1E1E1E] border-[#2EC4B6] text-[#2EC4B6] hover:bg-[#2a2a2a]"
          }`}
        style={{
          boxShadow: theme === "light"
            ? "4px 4px 0px 0px rgba(26,26,26,0.15)"
            : "4px 4px 0px 0px rgba(0,0,0,0.5)",
        }}
      >
        {soundOn ? <Volume2 size={22} strokeWidth={2.5} /> : <VolumeX size={22} strokeWidth={2.5} className="opacity-60" />}
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={handleToggleTheme}
        onMouseEnter={playHover}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        className={`relative p-3 rounded-full border-2 border-dashed transition-all duration-300
          hover:scale-110 active:scale-95
          ${theme === "light"
            ? "bg-white border-[#FF9F1C] text-[#FF9F1C] hover:bg-[#FFF9F0]"
            : "bg-[#1E1E1E] border-[#FF9F1C] text-[#FF9F1C] hover:bg-[#2a2a2a]"
          }`}
        style={{
          boxShadow: theme === "light"
            ? "4px 4px 0px 0px rgba(26,26,26,0.15)"
            : "4px 4px 0px 0px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
            transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {theme === "light"
            ? <Sun size={22} strokeWidth={2.5} />
            : <Moon size={22} strokeWidth={2.5} />
          }
        </div>

        {/* Ripple on click */}
        {spinning && (
          <span
            className="absolute inset-0 rounded-full border-2 border-[#FF9F1C] pointer-events-none"
            style={{ animation: "ping 0.5s ease-out forwards" }}
          />
        )}
      </button>
    </div>
  );
};

export default Navbar;
