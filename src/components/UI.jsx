import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

// ── InView hook (inline so UI.jsx has no extra import) ──────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Section Title ──────────────────────────────────────────────────────
export const SectionTitle = ({ subtitle, title, colorClass }) => {
  const { theme, currentTheme } = useTheme();
  const [ref, inView] = useInView(0.3);

  return (
    <div ref={ref} className="text-center mb-12 overflow-hidden">
      <div
        className={`text-xs font-bold tracking-[0.2em] uppercase mb-2 flex items-center justify-center gap-2 ${currentTheme.textMuted}
          transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <span className="inline-block w-8 h-[2px] bg-current opacity-40" />
        {subtitle}
        <span className="inline-block w-8 h-[2px] bg-current opacity-40" />
      </div>
      <h2
        className={`text-4xl md:text-5xl font-black uppercase tracking-tight relative inline-block
          ${colorClass || currentTheme.text}
          transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{
          textShadow: theme === "light" ? "4px 4px 0px rgba(0,0,0,0.1)" : "4px 4px 0px rgba(0,0,0,0.5)",
        }}
      >
        {title}
        {/* Underline draw animation */}
        <span
          className="absolute bottom-[-4px] left-0 h-[3px] rounded-full bg-current opacity-30"
          style={{
            width: inView ? "100%" : "0%",
            transition: "width 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s",
          }}
        />
      </h2>
    </div>
  );
};

// ── Card ───────────────────────────────────────────────────────────────
export const Card = ({ children, className = "", color = "orange", dashed = true, onClick, delay = 0 }) => {
  const { currentTheme } = useTheme();
  const colorObj = COLORS[color] || COLORS.orange;
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${currentTheme.cardBg} rounded-2xl p-6 relative
        ${dashed ? "border-[3px] border-dashed" : "border-[3px] border-solid"}
        ${colorObj.border}
        ${className}`}
      style={{
        boxShadow: hovered
          ? `10px 10px 0px 0px ${currentTheme.shadow}`
          : `8px 8px 0px 0px ${currentTheme.shadow}`,
        transform: inView
          ? hovered ? "translateY(-5px) rotate(0.3deg)" : "translateY(0) rotate(0)"
          : "translateY(28px)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease, box-shadow 0.2s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ── Badge ──────────────────────────────────────────────────────────────
export const Badge = ({ children, color = "gray", filled = false }) => {
  const { theme } = useTheme();
  const c = COLORS[color] || COLORS.gray;
  const bgClass = filled
    ? c.bg
    : theme === "dark" ? `bg-opacity-10 ${c.bg}` : `bg-opacity-10 ${c.bg}`;
  const textClass = filled
    ? (theme === "dark" ? "text-black" : "text-white")
    : c.text;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-dashed
        ${c.border} ${bgClass} ${textClass}
        inline-block transition-all duration-200
        hover:scale-105 hover:shadow-sm`}
    >
      {children}
    </span>
  );
};

// ── Skill Bar ─────────────────────────────────────────────────────────
export const SkillBar = ({ name, level, color = "teal", delay = 0 }) => {
  const { currentTheme } = useTheme();
  const c = COLORS[color] || COLORS.teal;
  const [ref, inView] = useInView(0.2);
  const [filled, setFilled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setFilled(true), delay + 200);
    return () => clearTimeout(t);
  }, [inView, delay]);

  return (
    <div
      ref={ref}
      className="mb-4 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between mb-1 items-center">
        <span className={`font-bold text-sm ${currentTheme.text} transition-all duration-200 ${hovered ? "translate-x-1" : ""}`}>
          {name}
        </span>
        <span
          className={`font-bold text-xs ${c.text} transition-all duration-300
            ${filled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
        >
          LVL {level}
        </span>
      </div>
      <div className={`h-4 w-full rounded-full border-2 overflow-hidden relative ${currentTheme.inputBg} ${currentTheme.inputBorder}`}>
        <div
          className={`h-full ${c.bg} relative shimmer-wrap`}
          style={{
            width: filled ? `${level}%` : "0%",
            transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${delay * 0.5}ms`,
          }}
        >
          <div className="skill-bar-stripes absolute inset-0" />
        </div>
        {/* Track marks */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-[1px] opacity-20 pointer-events-none"
            style={{ left: `${mark}%`, background: "currentColor" }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Stat Counter Card ──────────────────────────────────────────────────
export const StatCard = ({ icon: Icon, value, label, color }) => {
  const { currentTheme } = useTheme();
  const [ref, inView] = useInView(0.2);
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(true);
    setTimeout(() => setFlipped(false), 800);
  };

  return (
    <div ref={ref} onClick={handleClick}
      className={`${currentTheme.cardBg} rounded-2xl p-6 border-[3px] border-dashed ${COLORS[color].border}
        flex flex-col items-center text-center cursor-pointer select-none
        transition-all duration-500`}
      style={{
        boxShadow: `8px 8px 0px 0px ${currentTheme.shadow}`,
        transform: inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.92)",
        opacity: inView ? 1 : 0,
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
      }}>
      <Icon
        size={32}
        className={`mb-4 ${COLORS[color].text} transition-transform duration-300 ${flipped ? "scale-125 rotate-12" : "hover:scale-110"}`}
        strokeWidth={2.5}
      />
      <h3 className={`text-4xl font-black ${currentTheme.text} mb-1`}>{value}</h3>
      <p className={`text-sm font-bold ${currentTheme.textMuted} uppercase tracking-wide`}>{label}</p>
    </div>
  );
};
