import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Volume2, VolumeX, Gamepad2, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { playClick, playHover, isSoundEnabled, setSoundEnabled } from "../utils/soundFX";

const NAV_LINKS = [
  { label: "About",      id: "about"      },
  { label: "Skills",     id: "skills"     },
  { label: "Experience", id: "experience" },
  { label: "Projects",   id: "projects"   },
  { label: "Contact",    id: "contact"    },
];

const Navbar = ({ onOpenArcade }) => {
  const { theme, toggleTheme, currentTheme } = useTheme();
  const [spinning, setSpinning]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [soundOn, setSoundOn]     = useState(isSoundEnabled());
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      // Progress bar
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0);

      // Active section
      let current = "";
      for (const { id } of NAV_LINKS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 80) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleTheme = () => {
    playClick();
    setSpinning(true);
    toggleTheme();
    setTimeout(() => setSpinning(false), 500);
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) setTimeout(() => playClick(), 50);
  };

  const scrollToSection = useCallback((id) => {
    try { playClick(); } catch (_) {}
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* ── Scroll Progress Bar ─────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none">
        <div
          style={{
            height: "100%",
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #2EC4B6, #9B5DE5, #FF9F1C, #F15BB5)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* ── Main Navbar Header ─────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? `${currentTheme.cardBg} border-b border-dashed ${currentTheme.cardBorder} shadow-md backdrop-blur-md`
            : "bg-transparent"
        }`}
        style={{ paddingTop: "3px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

          {/* ── Brand Logo ── */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`font-black text-lg tracking-tighter ${currentTheme.text} hover:text-[#FF9F1C] transition-colors duration-200 cursor-pointer select-none`}
            style={{ textShadow: scrolled ? "none" : "2px 2px 0px #FF9F1C" }}
          >
            KR<span className="text-[#FF9F1C]">.</span>
          </button>

          {/* ── Nav Links (desktop) ── */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onMouseEnter={playHover}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider
                    transition-all duration-200 cursor-pointer select-none
                    ${isActive
                      ? "text-[#2EC4B6]"
                      : `${currentTheme.textMuted} hover:text-[#2EC4B6]`
                    }`}
                >
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#2EC4B6] transition-all duration-300"
                    style={{ width: isActive ? "70%" : "0%" }}
                  />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ── Right Icons (Desktop Controls) ── */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenArcade && (
              <button
                type="button"
                onClick={() => { try { playClick(); } catch (_) {} onOpenArcade(); }}
                onMouseEnter={playHover}
                title="Play Arcade"
                className={`p-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95
                  ${theme === "light" ? "bg-white border-[#F15BB5] text-[#F15BB5]" : "bg-[#14141F] border-[#F15BB5] text-[#F15BB5]"}`}
                style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
              >
                <Gamepad2 size={17} strokeWidth={2.5} />
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleSound}
              onMouseEnter={playHover}
              title={soundOn ? "Mute" : "Unmute"}
              className={`p-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95
                ${theme === "light" ? "bg-white border-[#2EC4B6] text-[#2EC4B6]" : "bg-[#14141F] border-[#2EC4B6] text-[#2EC4B6]"}`}
              style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
            >
              {soundOn ? <Volume2 size={17} strokeWidth={2.5} /> : <VolumeX size={17} strokeWidth={2.5} className="opacity-60" />}
            </button>

            <button
              type="button"
              onClick={handleToggleTheme}
              onMouseEnter={playHover}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className={`relative p-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95
                ${theme === "light" ? "bg-white border-[#FF9F1C] text-[#FF9F1C]" : "bg-[#14141F] border-[#FF9F1C] text-[#FF9F1C]"}`}
              style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
            >
              <div style={{ transform: spinning ? "rotate(360deg)" : "rotate(0deg)", transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
                {theme === "light" ? <Sun size={17} strokeWidth={2.5} /> : <Moon size={17} strokeWidth={2.5} />}
              </div>
            </button>
          </div>

          {/* ── Mobile Menu Toggle Button (Icon) ── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => { playClick(); setMobileOpen((o) => !o); }}
              aria-label="Toggle Mobile Menu"
              className={`p-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                ${theme === "light" ? "bg-white border-[#FF9F1C] text-[#FF9F1C]" : "bg-[#14141F] border-[#FF9F1C] text-[#FF9F1C]"}`}
              style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
            >
              {mobileOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Overlay Dropdown (All-in-one controls & links) ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`px-4 pb-5 pt-3 flex flex-col gap-3 border-t border-dashed ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
            
            {/* Action buttons (Sound, Theme, Arcade) in mobile dropdown */}
            <div className="flex items-center justify-around py-2 border-b border-dashed border-gray-700/20">
              {onOpenArcade && (
                <button
                  type="button"
                  onClick={() => { try { playClick(); } catch (_) {} onOpenArcade(); setMobileOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed text-xs font-black uppercase
                    ${theme === "light" ? "bg-white border-[#F15BB5] text-[#F15BB5]" : "bg-[#14141F] border-[#F15BB5] text-[#F15BB5]"}`}
                >
                  <Gamepad2 size={15} /> Arcade
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleSound}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed text-xs font-black uppercase
                  ${theme === "light" ? "bg-white border-[#2EC4B6] text-[#2EC4B6]" : "bg-[#14141F] border-[#2EC4B6] text-[#2EC4B6]"}`}
              >
                {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                {soundOn ? "Audio On" : "Muted"}
              </button>

              <button
                type="button"
                onClick={handleToggleTheme}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed text-xs font-black uppercase
                  ${theme === "light" ? "bg-white border-[#FF9F1C] text-[#FF9F1C]" : "bg-[#14141F] border-[#FF9F1C] text-[#FF9F1C]"}`}
              >
                {theme === "light" ? <Sun size={15} /> : <Moon size={15} />}
                {theme === "light" ? "Light" : "Dark"}
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider
                      transition-all duration-200 cursor-pointer flex items-center justify-between
                      ${isActive
                        ? "text-[#2EC4B6] bg-[#2EC4B6]/10"
                        : `${currentTheme.textMuted} hover:text-[#2EC4B6] hover:bg-[#2EC4B6]/5`
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#2EC4B6]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
