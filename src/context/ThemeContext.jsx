import { createContext, useContext, useState, useEffect } from "react";
import { THEMES } from "../config/theme";
import { AnimatedBackground } from "../components/AnimatedBackground";

// --- Theme Context ---
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// --- Theme Provider ---
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // Sync state with localStorage on change (redundant but safe)
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const currentTheme = THEMES[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <div
        className={`min-h-screen ${currentTheme.bg} font-sans selection:bg-[#FF9F1C] selection:text-white transition-colors duration-300 relative`}
      >
        {/* Dynamic Animated Cyber Background */}
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};
