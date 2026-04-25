import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// --- Navbar ---
// Currently only contains the theme toggle button (top-right corner)
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="fixed top-0 right-0 p-6 z-50">
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-full border-2 border-dashed transition-transform hover:scale-110 ${
          theme === "light"
            ? "bg-white border-[#FF9F1C] text-[#FF9F1C]"
            : "bg-[#1E1E1E] border-[#FF9F1C] text-[#FF9F1C]"
        }`}
        style={{
          boxShadow:
            theme === "light"
              ? "4px 4px 0px 0px rgba(26,26,26,0.2)"
              : "4px 4px 0px 0px rgba(0,0,0,0.5)",
        }}
      >
        {theme === "light" ? (
          <Sun size={24} strokeWidth={2.5} />
        ) : (
          <Moon size={24} strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
};

export default Navbar;
