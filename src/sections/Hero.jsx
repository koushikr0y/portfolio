import { useEffect, useRef, useState } from "react";
import { Github, Twitter, Gamepad2, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

const PARTICLES = [
  { x: "8%",  delay: "0s",   dur: "4.2s", color: "#FF9F1C", size: 6 },
  { x: "18%", delay: "0.9s", dur: "5.1s", color: "#2EC4B6", size: 4 },
  { x: "72%", delay: "1.3s", dur: "3.8s", color: "#9B5DE5", size: 5 },
  { x: "84%", delay: "0.4s", dur: "4.6s", color: "#F15BB5", size: 6 },
  { x: "50%", delay: "2.1s", dur: "5.5s", color: "#FF9F1C", size: 3 },
  { x: "33%", delay: "1.6s", dur: "4.1s", color: "#2EC4B6", size: 4 },
  { x: "62%", delay: "0.7s", dur: "6.2s", color: "#9B5DE5", size: 5 },
  { x: "92%", delay: "2.6s", dur: "3.9s", color: "#F15BB5", size: 3 },
  { x: "4%",  delay: "1.9s", dur: "5.0s", color: "#FF9F1C", size: 4 },
  { x: "44%", delay: "0.5s", dur: "4.3s", color: "#2EC4B6", size: 6 },
];

function useTypewriter(words, speed = 90) {
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

const Hero = () => {
  const { currentTheme, theme } = useTheme();
  const [xpVisible, setXpVisible] = useState(false);
  const [socialHover, setSocialHover] = useState(null);

  const typeText = useTypewriter(
    ["Game Developer", "Unity Expert", "Godot Enthusiast", "C# · C++ · Python"]
  );

  useEffect(() => {
    const t = setTimeout(() => setXpVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  const socialLinks = [
    { href: "https://github.com/koushikr0y", icon: Github,   color: "purple", label: "GitHub" },
    { href: "https://koushikroy.itch.io/",               icon: Gamepad2, color: "orange", label: "itch.io" },
    { href: "https://x.com/ezzgama",         icon: Twitter,  color: "teal",   label: "Twitter" },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Grid bg */}
      <div className={`absolute inset-0 pointer-events-none ${theme === "light" ? "bg-grid-light" : "bg-grid-dark"}`} />

      {/* Pixel particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div key={i} className="pixel-particle" style={{
            left: p.x, bottom: "-10px",
            width: p.size, height: p.size,
            background: p.color,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }} />
        ))}
      </div>

      {/* Avatar */}
      <div className="relative mb-8 group cursor-pointer animate-pixel-enter">
        <div className="absolute inset-[-10px] rounded-full border-4 border-dashed border-[#FF9F1C] opacity-30"
          style={{ animation: "spin 14s linear infinite" }} />
        <div className="absolute inset-[-20px] rounded-full border-2 border-dashed border-[#2EC4B6] opacity-20"
          style={{ animation: "spin 22s linear infinite reverse" }} />

        <div className={`w-40 h-40 rounded-full ${currentTheme.cardBg} border-4 border-dashed ${COLORS.orange.border} p-2 relative z-10
          shadow-[0px_0px_0px_8px_rgba(255,159,28,0.1)]
          group-hover:shadow-[0px_0px_0px_14px_rgba(255,159,28,0.15),0_20px_40px_rgba(255,159,28,0.2)]
          animate-float transition-shadow duration-500`}>
          <div className="w-full h-full bg-[#FFE5D9] rounded-full overflow-hidden relative flex items-center justify-center">
            <div className="w-full h-full absolute top-4">
              <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Riley" alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>

        <div className={`absolute -bottom-2 -right-2 ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-full p-2 z-20
          transition-all duration-300 group-hover:rotate-[20deg] group-hover:scale-125 group-hover:border-[#9B5DE5]`}>
          <Gamepad2 size={20} className={`${COLORS.purple.text} transition-transform`} />
        </div>
      </div>

      {/* Press Start */}
      <div className={`${COLORS.orange.text} text-xs font-bold tracking-[0.3em] uppercase mb-3 animate-slide-up animate-flicker`}
        style={{ animationDelay: "100ms" }}>
        ▶ Press Start ◀
      </div>

      {/* Name — glitch on hover */}
      <h1
        className={`text-6xl md:text-8xl font-black ${currentTheme.text} tracking-tighter mb-4 text-center relative z-10
          glitch-text animate-slide-up cursor-default select-none`}
        data-text="Koushik Roy"
        style={{ textShadow: "6px 6px 0px #FF9F1C", animationDelay: "200ms" }}
      >
        Koushik Roy
      </h1>

      {/* Typewriter badge */}
      <div className={`${currentTheme.cardBg} px-8 py-3 rounded-xl border-[3px] border-dashed ${COLORS.pink.border}
        shadow-[6px_6px_0px_rgba(241,91,181,0.2)] mb-8 transform -rotate-1
        hover:rotate-0 hover:shadow-[8px_8px_0px_rgba(241,91,181,0.3)] hover:-translate-y-1
        transition-all duration-300 animate-slide-up`}
        style={{ animationDelay: "300ms" }}>
        <span className={`text-xl font-black ${COLORS.pink.text} tracking-widest cursor-blink`}>
          {typeText || "\u00A0"}
        </span>
      </div>

      {/* Socials */}
      <div className="flex gap-4 mb-10 animate-slide-up" style={{ animationDelay: "400ms" }}>
        {socialLinks.map(({ href, icon: Icon, color, label }, i) => (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer"
            title={label}
            onMouseEnter={() => setSocialHover(i)}
            onMouseLeave={() => setSocialHover(null)}
            className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed
              ${socialHover === i ? COLORS[color].border : (theme === "dark" ? "border-gray-600" : "border-[#1A1A1A]")}
              ${socialHover === i ? COLORS[color].text : currentTheme.text}
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
              hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.25)]
              hover:-translate-y-1.5 hover:scale-110
              active:translate-y-0 active:scale-95
              transition-all duration-200`}>
            <Icon size={24} className={`transition-transform duration-200 ${socialHover === i ? "scale-110" : ""}`} />
          </a>
        ))}
      </div>

      {/* XP Bar */}
      <div className={`${currentTheme.cardBg} p-2 rounded-xl border-[3px] border-dashed ${COLORS.teal.border}
        shadow-[6px_6px_0px_rgba(46,196,182,0.2)] w-full max-w-md flex items-center gap-4
        transform rotate-1 hover:rotate-0 hover:shadow-[8px_8px_0px_rgba(46,196,182,0.3)] hover:-translate-y-1
        transition-all duration-300 animate-slide-up`}
        style={{ animationDelay: "500ms" }}>
        <div className="flex flex-col items-center px-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase">LVL</span>
          <span className={`text-2xl font-black ${currentTheme.text} leading-none`}
            style={{ textShadow: "2px 2px 0 rgba(46,196,182,0.35)" }}>24</span>
        </div>
        <div className="flex-1">
          <div className={`h-4 ${currentTheme.inputBg} rounded-full overflow-hidden border ${currentTheme.inputBorder} relative`}>
            <div className={`h-full ${COLORS.teal.bg} relative shimmer-wrap`}
              style={{
                width: xpVisible ? "75%" : "0%",
                transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)",
              }}>
              <div className="skill-bar-stripes absolute inset-0" />
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400 font-bold">XP</span>
            <span className="text-[10px] text-gray-400 font-bold">12,450 / 15,000</span>
          </div>
        </div>
      </div>

      {/* Scroll down */}
      <div className="absolute bottom-10 flex flex-col items-center gap-1 animate-bounce"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        style={{ cursor: "pointer" }}>
        <span className={`text-[9px] font-bold tracking-widest uppercase ${currentTheme.textMuted} opacity-50`}>scroll</span>
        <div className={`w-11 h-11 rounded-full border-2 border-dashed ${COLORS.orange.border} flex items-center justify-center ${COLORS.orange.text}
          hover:bg-[#FF9F1C] hover:text-white hover:border-solid hover:scale-110 transition-all duration-200`}>
          <ChevronDown size={22} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
