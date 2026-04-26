import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme, currentTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    setSpinning(true);
    toggleTheme();
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <div className="fixed top-0 right-0 p-6 z-50">
      {/* Backdrop blur pill on scroll */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-400 pointer-events-none ${
          scrolled ? "backdrop-blur-sm bg-black/5" : ""
        }`}
      />

      <button
        onClick={handleToggle}
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
            ? <Sun  size={24} strokeWidth={2.5} />
            : <Moon size={24} strokeWidth={2.5} />
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
