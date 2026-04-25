import { Heart, Gamepad2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

// --- Footer ---
const Footer = () => {
  const { currentTheme } = useTheme();
  return (
    <footer className={`py-8 border-t-2 border-dashed ${currentTheme.inputBorder} text-center`}>
      <div className={`flex items-center justify-center gap-2 mb-2 font-black ${currentTheme.text}`}>
        <div className={`p-1 border-2 border-dashed ${COLORS.orange.border} rounded ${COLORS.orange.text}`}>
          <Gamepad2 size={20} />
        </div>
        Koushik Roy
      </div>
      <p className={`text-xs font-bold ${currentTheme.textMuted}`}>
        Made with{" "}
        <Heart size={10} className={`inline ${COLORS.pink.text} fill-[#F15BB5]`} />{" "}
        © 2025 All rights reserved • v1.0.0
      </p>
    </footer>
  );
};

export default Footer;
