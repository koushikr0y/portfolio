import { useEffect, useRef, useState } from "react";
import { Github, Twitter, Gamepad2, ChevronDown, Sparkles, Send, Rocket, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { playClick, playHover } from "../utils/soundFX";

const PARTICLES = [
  { x: "8%", delay: "0s", dur: "4.2s", color: "#FF9F1C", size: 6 },
  { x: "18%", delay: "0.9s", dur: "5.1s", color: "#2EC4B6", size: 4 },
  { x: "72%", delay: "1.3s", dur: "3.8s", color: "#9B5DE5", size: 5 },
  { x: "84%", delay: "0.4s", dur: "4.6s", color: "#F15BB5", size: 6 },
  { x: "50%", delay: "2.1s", dur: "5.5s", color: "#FF9F1C", size: 3 },
  { x: "33%", delay: "1.6s", dur: "4.1s", color: "#2EC4B6", size: 4 },
  { x: "62%", delay: "0.7s", dur: "6.2s", color: "#9B5DE5", size: 5 },
  { x: "92%", delay: "2.6s", dur: "3.9s", color: "#F15BB5", size: 3 },
  { x: "4%", delay: "1.9s", dur: "5.0s", color: "#FF9F1C", size: 4 },
  { x: "44%", delay: "0.5s", dur: "4.3s", color: "#2EC4B6", size: 6 },
];

function useTypewriter(words, speed = 80) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [pausing, setPausing] = useState(false);

  useEffect(() => {
    if (pausing) return;
    const word = words[wordIdx % words.length];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          const next = word.slice(0, charIdx + 1);
          setDisplay(next);
          if (charIdx + 1 === word.length) {
            setPausing(true);
            setTimeout(() => { setPausing(false); setDeleting(true); }, 1800);
          } else {
            setCharIdx((c) => c + 1);
          }
        } else {
          const next = word.slice(0, charIdx - 1);
          setDisplay(next);
          if (charIdx - 1 === 0) {
            setDeleting(false);
            setWordIdx((w) => w + 1);
            setCharIdx(0);
          } else {
            setCharIdx((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pausing]);

  return display;
}

const Hero = ({ onOpenArcade }) => {
  const { currentTheme, theme } = useTheme();
  const [socialHover, setSocialHover] = useState(null);

  const typeText = useTypewriter([
    "Lead Unity Game Developer",
    "Multiplayer Systems Architect",
    "Game Performance & Optimization",
    "C# · C++ · Photon Fusion"
  ]);

  const socialLinks = [
    { href: "https://github.com/koushikr0y", icon: Github, color: "purple", label: "GitHub" },
    { href: "https://koushikroy.itch.io/", icon: Gamepad2, color: "orange", label: "itch.io" },
    { href: "https://x.com/ezzgama", icon: Twitter, color: "teal", label: "Twitter" },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2EC4B6]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Status Available Pill Badge */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A]
          ${currentTheme.cardBg} ${currentTheme.text} shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2`}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse" />
          <span>Available for New Projects & Game Roles</span>
        </div>
      </div>

      {/* Avatar Container */}
      <div className="relative mb-6 group cursor-pointer animate-pixel-enter">
        <div className="absolute inset-[-12px] rounded-full border-4 border-dashed border-[#FF9F1C] opacity-35"
          style={{ animation: "spin 16s linear infinite" }} />
        <div className="absolute inset-[-24px] rounded-full border-2 border-dashed border-[#2EC4B6] opacity-25"
          style={{ animation: "spin 26s linear infinite reverse" }} />

        <div className={`w-40 h-40 md:w-44 md:h-44 rounded-full ${currentTheme.cardBg} border-4 border-dashed ${COLORS.orange.border} p-2 relative z-10
          shadow-[0px_0px_0px_8px_rgba(255,159,28,0.12)]
          group-hover:shadow-[0px_0px_0px_14px_rgba(255,159,28,0.18),0_20px_40px_rgba(255,159,28,0.25)]
          animate-float transition-all duration-500`}>
          <div className="w-full h-full bg-[#FFE5D9] rounded-full overflow-hidden relative flex items-center justify-center">
            <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Riley" alt="Koushik Roy Avatar"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>

        {/* Level Tag Overlay */}
        <div className={`absolute -bottom-1 -right-2 ${COLORS.teal.bg} text-black font-black text-xs px-3 py-1 rounded-xl border-2 border-[#1A1A1A] z-20 shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1 group-hover:scale-110 transition-transform`}>
          <Sparkles size={13} /> LVL 24 DEV
        </div>
      </div>

      {/* Hero Name Header */}
      <h1
        className={`text-5xl sm:text-7xl md:text-8xl font-black ${currentTheme.text} tracking-tighter mb-3 text-center relative z-10
          glitch-text animate-slide-up cursor-default select-none`}
        data-text="Koushik Roy"
        style={{ textShadow: "6px 6px 0px #FF9F1C", animationDelay: "150ms" }}
      >
        Koushik Roy
      </h1>

      {/* Typewriter Specialization Badge */}
      <div className={`${currentTheme.cardBg} px-6 py-2.5 md:px-8 md:py-3 rounded-2xl border-[3px] border-dashed ${COLORS.pink.border}
        shadow-[6px_6px_0px_0px_#1A1A1A] mb-8 transform -rotate-1
        hover:rotate-0 hover:shadow-[8px_8px_0px_0px_#1A1A1A] hover:-translate-y-1
        transition-all duration-300 animate-slide-up`}
        style={{ animationDelay: "250ms" }}>
        <span className={`text-base md:text-xl font-black ${COLORS.pink.text} tracking-wider`}>
          {typeText || "\u00A0"}
        </span>
      </div>

      {/* Primary Call To Action (CTA) Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-slide-up z-20" style={{ animationDelay: "350ms" }}>
        <button
          onClick={() => { playClick(); scrollToSection("projects"); }}
          onMouseEnter={playHover}
          className="bg-[#2EC4B6] hover:bg-[#23ad9f] text-black px-6 py-3.5 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-wider
            border-2 border-black/40 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.5)]
            hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,0.6)]
            active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group cursor-pointer"
        >
          <Rocket size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span>Explore Projects Showcase</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => { playClick(); scrollToSection("contact"); }}
          onMouseEnter={playHover}
          className={`${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10 px-6 py-3.5 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-wider
            border-2 border-white/20 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.5)]
            hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,0.6)]
            active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer`}
        >
          <Send size={16} />
          <span>Get in Touch</span>
        </button>
      </div>

      {/* Social Links Bar */}
      <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: "450ms" }}>
        {socialLinks.map(({ href, icon: Icon, color, label }, i) => (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer"
            title={label}
            onMouseEnter={() => setSocialHover(i)}
            onMouseLeave={() => setSocialHover(null)}
            className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed
              ${socialHover === i ? COLORS[color].border : (theme === "dark" ? "border-gray-600" : "border-[#1A1A1A]")}
              ${socialHover === i ? COLORS[color].text : currentTheme.text}
              shadow-[4px_4px_0px_0px_#1A1A1A]
              hover:shadow-[6px_6px_0px_0px_#1A1A1A]
              hover:-translate-y-1.5 hover:scale-110
              active:translate-y-0 active:scale-95
              transition-all duration-200`}>
            <Icon size={22} className={`transition-transform duration-200 ${socialHover === i ? "scale-110" : ""}`} />
          </a>
        ))}
      </div>

      {/* Smooth Scroll Down Indicator */}
      <div
        className="mt-14 flex flex-col items-center gap-1.5 animate-bounce cursor-pointer group"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}
      >
        <span className={`text-[10px] font-black tracking-widest uppercase ${currentTheme.textMuted} opacity-60 group-hover:opacity-100 transition-opacity`}>
          Scroll Down
        </span>
        <div className={`w-10 h-10 rounded-full border-2 border-dashed ${COLORS.orange.border} flex items-center justify-center ${COLORS.orange.text}
          hover:bg-[#FF9F1C] hover:text-white hover:border-solid hover:scale-110 transition-all duration-200 shadow-[2px_2px_0px_0px_#1A1A1A]`}>
          <ChevronDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
