import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

// --- Section Title ---
export const SectionTitle = ({ subtitle, title, colorClass }) => {
  const { theme, currentTheme } = useTheme();
  return (
    <div className="text-center mb-12">
      <div
        className={`text-xs font-bold tracking-[0.2em] uppercase mb-2 flex items-center justify-center gap-2 ${currentTheme.textMuted}`}
      >
        {subtitle}
      </div>
      <h2
        className={`text-4xl md:text-5xl font-black uppercase tracking-tight relative inline-block ${colorClass || currentTheme.text}`}
        style={{
          textShadow:
            theme === "light"
              ? "4px 4px 0px rgba(0,0,0,0.1)"
              : "4px 4px 0px rgba(0,0,0,0.5)",
        }}
      >
        {title}
      </h2>
    </div>
  );
};

// --- Card ---
export const Card = ({ children, className = "", color = "orange", dashed = true, onClick }) => {
  const { currentTheme } = useTheme();
  const colorObj = COLORS[color] || COLORS.orange;

  return (
    <div
      onClick={onClick}
      className={`${currentTheme.cardBg} rounded-2xl p-6 relative ${dashed ? "border-[3px] border-dashed" : "border-[3px] border-solid"} ${colorObj.border} transition-transform hover:-translate-y-1 ${className}`}
      style={{ boxShadow: `8px 8px 0px 0px ${currentTheme.shadow}` }}
    >
      {children}
    </div>
  );
};

// --- Badge ---
export const Badge = ({ children, color = "gray", filled = false }) => {
  const { theme } = useTheme();
  const c = COLORS[color] || COLORS.gray;

  const bgClass = filled
    ? c.bg
    : theme === "dark"
    ? `bg-opacity-10 ${c.bg}`
    : `bg-opacity-10 ${c.bg}`;
  const textClass = filled
    ? theme === "dark"
      ? "text-black"
      : "text-white"
    : c.text;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-dashed ${c.border} ${bgClass} ${textClass}`}
    >
      {children}
    </span>
  );
};

// --- Skill Bar ---
export const SkillBar = ({ name, level, color = "teal" }) => {
  const { currentTheme } = useTheme();
  const c = COLORS[color] || COLORS.teal;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className={`font-bold text-sm ${currentTheme.text}`}>{name}</span>
        <span className={`font-bold text-xs ${c.text}`}>LVL {level}</span>
      </div>
      <div
        className={`h-4 w-full rounded-full border-2 overflow-hidden relative ${currentTheme.inputBg} ${currentTheme.inputBorder}`}
      >
        <div
          className={`h-full ${c.bg} transition-all duration-1000 ease-out relative`}
          style={{ width: `${level}%` }}
        >
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
  );
};
