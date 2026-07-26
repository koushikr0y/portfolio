import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { playClick, playHover } from "../utils/soundFX";

/**
 * Hire Me floating sticky CTA pill (bottom-right corner).
 * Appears after scrolling 200px.
 */
const FloatingUI = () => {
  const { currentTheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [hireHovered, setHireHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goContact = () => {
    playClick();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.9)",
        transition: "opacity 0.35s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <button
        onClick={goContact}
        onMouseEnter={() => { setHireHovered(true); playHover(); }}
        onMouseLeave={() => setHireHovered(false)}
        className="relative flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-widest
          bg-[#2EC4B6] text-black border-2 border-black/20
          shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]
          hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]
          hover:-translate-y-1 active:translate-y-0.5 active:shadow-none
          transition-all duration-200 overflow-hidden group cursor-pointer"
      >
        {/* Shimmer sweep */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        <span className="relative flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black/50 animate-pulse" />
          Hire Me
        </span>
      </button>
    </div>
  );
};

export default FloatingUI;
