import { Github, Twitter, Gamepad2, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

// --- Hero Section ---
const Hero = () => {
  const { currentTheme } = useTheme();
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Avatar */}
      <div className="relative mb-8 group cursor-pointer">
        <div
          className={`w-40 h-40 rounded-full ${currentTheme.cardBg} border-4 border-dashed ${COLORS.orange.border} p-2 relative z-10 shadow-[0px_0px_0px_8px_rgba(255,159,28,0.1)] group-hover:scale-105 transition-transform duration-300`}
        >
          <div className="w-full h-full bg-[#FFE5D9] rounded-full overflow-hidden relative flex items-center justify-center">
            <div className="w-full h-full absolute top-4">
              <img
                src="https://api.dicebear.com/9.x/notionists/svg?seed=Riley"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div
          className={`absolute -bottom-2 -right-2 ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-full p-2 z-20`}
        >
          <Gamepad2 size={20} className={COLORS.purple.text} />
        </div>
      </div>

      {/* Press Start */}
      <div className={`${COLORS.orange.text} text-xs font-bold tracking-[0.3em] uppercase mb-2 animate-pulse`}>
        ▶ Press Start ◀
      </div>

      {/* Name */}
      <h1
        className={`text-6xl md:text-8xl font-black ${currentTheme.text} tracking-tighter mb-4 text-center relative z-10`}
        style={{ textShadow: "6px 6px 0px #FF9F1C" }}
      >
        Koushik Roy
      </h1>

      {/* Title Badge */}
      <div
        className={`${currentTheme.cardBg} px-8 py-3 rounded-xl border-[3px] border-dashed ${COLORS.pink.border} shadow-[6px_6px_0px_rgba(241,91,181,0.2)] mb-8 transform -rotate-1 hover:rotate-0 transition-transform`}
      >
        <span className={`text-xl font-black ${COLORS.pink.text} tracking-widest`}>
          GAME DEVELOPER
        </span>
      </div>

      {/* Social Links Row */}
      <div className="flex gap-4 mb-10">
        <a
          href="https://github.com/koushikr0y"
          target="_blank"
          rel="noopener noreferrer"
          className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed ${currentTheme.text === "text-[#E0E0E0]" ? "border-gray-600" : "border-[#1A1A1A]"} ${currentTheme.text} hover:scale-110 hover:${COLORS.purple.text} hover:${COLORS.purple.border} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}
        >
          <Github size={24} />
        </a>
        <a
          href="https://itch.io"
          target="_blank"
          rel="noopener noreferrer"
          className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed ${currentTheme.text === "text-[#E0E0E0]" ? "border-gray-600" : "border-[#1A1A1A]"} ${currentTheme.text} hover:scale-110 hover:${COLORS.orange.text} hover:${COLORS.orange.border} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}
        >
          <Gamepad2 size={24} />
        </a>
        <a
          href="https://x.com/ezzgama"
          target="_blank"
          rel="noopener noreferrer"
          className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed ${currentTheme.text === "text-[#E0E0E0]" ? "border-gray-600" : "border-[#1A1A1A]"} ${currentTheme.text} hover:scale-110 hover:${COLORS.teal.text} hover:${COLORS.teal.border} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}
        >
          <Twitter size={24} />
        </a>
      </div>

      {/* Level Bar */}
      <div
        className={`${currentTheme.cardBg} p-2 rounded-xl border-[3px] border-dashed ${COLORS.teal.border} shadow-[6px_6px_0px_rgba(46,196,182,0.2)] w-full max-w-md flex items-center gap-4 transform rotate-1 hover:rotate-0 transition-transform`}
      >
        <div className="flex flex-col items-center px-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase">LVL</span>
          <span className={`text-2xl font-black ${currentTheme.text} leading-none`}>24</span>
        </div>
        <div className="flex-1">
          <div
            className={`h-4 ${currentTheme.inputBg} rounded-full overflow-hidden border ${currentTheme.inputBorder}`}
          >
            <div className={`h-full ${COLORS.teal.bg} w-[75%] relative`}>
              <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400 font-bold">XP</span>
            <span className="text-[10px] text-gray-400 font-bold">12,450 / 15,000</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-10 animate-bounce">
        <div
          className={`w-12 h-12 rounded-full border-2 border-dashed ${COLORS.orange.border} flex items-center justify-center ${COLORS.orange.text}`}
        >
          <ChevronDown size={24} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
