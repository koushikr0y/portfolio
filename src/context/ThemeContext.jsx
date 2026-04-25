import { createContext, useContext, useState, useEffect } from "react";
import { THEMES } from "../config/theme";

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
        className={`min-h-screen ${currentTheme.bg} font-sans selection:bg-[#FF9F1C] selection:text-white transition-colors duration-300`}
      >
        {/* Background Grid Pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${theme === "light" ? "#1A1A1A" : "#FFF"} 1px, transparent 1px), linear-gradient(90deg, ${theme === "light" ? "#1A1A1A" : "#FFF"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
