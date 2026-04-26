import { useRef, useState, useEffect } from "react";
import { Github, Twitter, Gamepad2, Heart, ArrowUp, Mail } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const SOCIAL_LINKS = [
  { href: "https://github.com/koushikr0y", icon: Github,   color: "purple", label: "GitHub"  },
  { href: "https://koushikroy.itch.io/",               icon: Gamepad2, color: "orange", label: "itch.io" },
  { href: "https://x.com/ezzgama",         icon: Twitter,  color: "teal",   label: "Twitter" },
  { href: "mailto:koushik22work@gmail.com",icon: Mail,     color: "pink",   label: "Email"   },
];

const NAV_LINKS = [
  { label: "About",      href: "#stats"      },
  { label: "Skills",     href: "#skills"     },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects"   },
  { label: "Contact",    href: "#contact"    },
];

const PIXEL_PARTICLES = [
  { x: "5%",  delay: "0s",   dur: "5s",  color: "#FF9F1C", size: 5 },
  { x: "20%", delay: "1s",   dur: "4s",  color: "#2EC4B6", size: 4 },
  { x: "50%", delay: "0.5s", dur: "6s",  color: "#9B5DE5", size: 6 },
  { x: "75%", delay: "1.5s", dur: "4.5s",color: "#F15BB5", size: 4 },
  { x: "90%", delay: "0.2s", dur: "5.5s",color: "#FF9F1C", size: 5 },
  { x: "35%", delay: "2s",   dur: "3.8s",color: "#2EC4B6", size: 3 },
  { x: "60%", delay: "0.8s", dur: "5.2s",color: "#9B5DE5", size: 5 },
];

const Footer = () => {
  const { currentTheme, theme } = useTheme();
  const [ref, inView] = useInView(0.05);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [heartBeating, setHeartBeating] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={ref}
      className={`relative overflow-hidden border-t-[3px] border-dashed ${
        theme === "dark" ? "border-[#333]" : "border-gray-200"
      } pt-16 pb-8`}
    >
      {/* Floating pixel particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PIXEL_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="pixel-particle"
            style={{
              left: p.x, bottom: "-10px",
              width: p.size, height: p.size,
              background: p.color,
              animationDuration: p.dur,
              animationDelay: p.delay,
              opacity: 0.45,
            }}
          />
        ))}
      </div>

      <div
        className="max-w-6xl mx-auto px-4 relative z-10"
        style={{
          transform: inView ? "translateY(0)" : "translateY(32px)",
          opacity: inView ? 1 : 0,
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease",
        }}
      >
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand column */}
          <div
            style={{
              transform: inView ? "translateX(0)" : "translateX(-24px)",
              opacity: inView ? 1 : 0,
              transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.6s ease 0.1s",
            }}
          >
            <div className={`text-3xl font-black ${currentTheme.text} tracking-tighter mb-1`}
              style={{ textShadow: "3px 3px 0px #FF9F1C" }}>
              KOUSHIK ROY
            </div>
            <div className={`text-xs font-bold tracking-widest ${COLORS.teal.text} uppercase mb-4`}>
              Game Developer · Level 24
            </div>
            <p className={`text-sm font-medium ${currentTheme.textMuted} leading-relaxed`}>
              Crafting immersive worlds and unforgettable gameplay experiences, one commit at a time.
            </p>
          </div>

          {/* Quick nav column */}
          <div
            className="flex flex-col"
            style={{
              transform: inView ? "translateY(0)" : "translateY(20px)",
              opacity: inView ? 1 : 0,
              transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s, opacity 0.6s ease 0.2s",
            }}
          >
            {/* <div className={`text-xs font-black uppercase tracking-widest ${COLORS.orange.text} mb-4 flex items-center gap-2`}>
              <span className="inline-block w-5 h-[2px] bg-[#FF9F1C]" />
              Quick Nav
            </div>
            <ul className="space-y-2">
              {NAV_LINKS.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className={`text-sm font-bold ${currentTheme.textMuted} flex items-center gap-2
                      hover:${COLORS.orange.text} hover:translate-x-1
                      transition-all duration-200 group w-fit`}
                    style={{
                      animation: inView ? `slide-left 0.35s ease both` : "none",
                      animationDelay: `${0.25 + i * 0.06}s`,
                    }}
                  >
                    <span className={`text-[#FF9F1C] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -ml-4 group-hover:ml-0`}>
                      ▶
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Social column */}
          <div
            style={{
              transform: inView ? "translateX(0)" : "translateX(24px)",
              opacity: inView ? 1 : 0,
              transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s, opacity 0.6s ease 0.25s",
            }}
          >
            <div className={`text-xs font-black uppercase tracking-widest ${COLORS.pink.text} mb-4 flex items-center gap-2`}>
              <span className="inline-block w-5 h-[2px] bg-[#F15BB5]" />
              Find Me
            </div>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ href, icon: Icon, color, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  onMouseEnter={() => setHoveredSocial(i)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed
                    ${hoveredSocial === i ? COLORS[color].border : currentTheme.inputBorder}
                    ${hoveredSocial === i ? COLORS[color].text : currentTheme.textMuted}
                    shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)]
                    hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.18)]
                    hover:-translate-y-1 hover:scale-110
                    active:translate-y-0 active:scale-95
                    transition-all duration-200`}
                  style={{
                    animation: inView ? "burst 0.4s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
                    animationDelay: `${0.3 + i * 0.08}s`,
                  }}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>

            {/* XP bar for fun
            <div className={`mt-6 p-3 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg}`}>
              <div className="flex justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase ${currentTheme.textMuted}`}>Portfolio Score</span>
                <span className={`text-[10px] font-black ${COLORS.teal.text}`}>A+ Rank</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-[#333]" : "bg-gray-200"} relative`}>
                <div
                  className={`h-full ${COLORS.teal.bg} relative shimmer-wrap`}
                  style={{
                    width: inView ? "92%" : "0%",
                    transition: "width 1.4s cubic-bezier(0.22,1,0.36,1) 0.5s",
                  }}
                >
                  <div className="skill-bar-stripes absolute inset-0" />
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t-2 border-dashed ${theme === "dark" ? "border-[#2a2a2a]" : "border-gray-200"} pt-8 flex flex-col md:flex-row justify-between items-center gap-4`}
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          {/* Copyright */}
          <p
            className={`text-xs font-bold ${currentTheme.textMuted} flex items-center gap-1.5 flex-wrap justify-center`}
            onClick={() => {
              setHeartBeating(true);
              setTimeout(() => setHeartBeating(false), 600);
            }}
          >
            © {new Date().getFullYear()} Koushik Roy · Made with
            <Heart
              size={14}
              className={`${COLORS.pink.text} cursor-pointer transition-transform duration-200 inline-block align-middle
                ${heartBeating ? "scale-150" : "scale-100"}`}
              fill="currentColor"
            />
            & too much ☕
          </p>

          {/* Tech badge pills */}
          {/* <div className="flex flex-wrap gap-2 justify-center">
            {["React", "Tailwind", "Vite", "Gemini AI"].map((tech, i) => (
              <span
                key={i}
                className={`text-[10px] font-black px-2.5 py-1 rounded-full
                  border border-dashed ${currentTheme.inputBorder} ${currentTheme.textMuted}
                  hover:scale-105 hover:border-[#FF9F1C] hover:text-[#FF9F1C]
                  transition-all duration-200 cursor-default`}
              >
                {tech}
              </span>
            ))}
          </div> */}

          {/* Game tag */}
          <div
            className={`text-[10px] font-black tracking-widest uppercase ${COLORS.orange.text} animate-flicker`}
          >
            SAVE SLOT 01 ◆ AUTO
          </div>
        </div>
      </div>

      {/* Back to top FAB */}
      <button
        onClick={scrollToTop}
        title="Back to top"
        className={`fixed bottom-24 left-6 z-50 p-3 rounded-full border-2 border-dashed
          ${COLORS.orange.border} ${COLORS.orange.text} ${currentTheme.cardBg}
          shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
          hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.25)]
          hover:-translate-y-1 hover:scale-110
          active:translate-y-0 active:shadow-none active:scale-95
          transition-all duration-200`}
        style={{
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? "auto" : "none",
          transform: showTop ? "scale(1) translateY(0)" : "scale(0.7) translateY(8px)",
          transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;
