import { useRef, useState, useEffect } from "react";
import { Mail, Send, Zap, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { Card } from "../components/UI";
import { model } from "../config/gemini";

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

// Floating label input field
const FloatingInput = ({ label, type = "text", value, onChange, placeholder, multiline, rows, color = "teal" }) => {
  const { currentTheme } = useTheme();
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const active = focused || hasValue;

  const baseClass = `w-full ${currentTheme.inputBg} border-2 border-dashed rounded-lg p-3 pt-6 font-medium
    ${currentTheme.text} placeholder-transparent
    transition-all duration-200 resize-none
    ${focused
      ? `border-[${color === "teal" ? "#2EC4B6" : "#9B5DE5"}] shadow-[0_0_0_3px_rgba(46,196,182,0.15),4px_4px_0px_rgba(46,196,182,0.3)]`
      : `${currentTheme.inputBorder} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)]`
    }`;

  return (
    <div className="relative">
      <label
        className={`absolute left-3 font-bold text-xs uppercase tracking-wider pointer-events-none
          transition-all duration-200 ease-out
          ${active
            ? `top-2 ${focused ? COLORS[color].text : currentTheme.textMuted} text-[10px]`
            : `top-4 ${currentTheme.textMuted} text-xs`
          }`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={rows || 4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
          style={{ outline: "none" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
          style={{ outline: "none" }}
        />
      )}
      {/* Focus glow ring */}
      {focused && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `0 0 0 3px rgba(46,196,182,0.18)`,
            animation: "none",
          }}
        />
      )}
    </div>
  );
};

// XP reward floating animation
const XPReward = ({ show }) => (
  <div
    className={`absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-black text-[#FF9F1C]
      pointer-events-none select-none transition-all duration-500
      ${show ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"}`}
  >
    +100 XP ✨
  </div>
);

const Contact = () => {
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const [headerRef, headerInView] = useInView(0.2);
  const [leftRef, leftInView]   = useInView(0.1);
  const [rightRef, rightInView] = useInView(0.1);

  const generateQuestBrief = async () => {
    if (!message.trim() || isDrafting) return;
    setIsDrafting(true);
    try {
      const prompt = `Rewrite this request into a formal RPG Quest Brief. Include: "Quest Title", "Objective", and "Rewards". Request: "${message}"`;
      const result = await model.generateContent(prompt);
      setMessage(result.response.text());
    } catch (e) {
      // Fail silently
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSending(true);
    setTimeout(() => {
      const subject = `New Quest from ${name || "Adventurer"}`;
      const body = `Adventurer Name: ${name}\nContact Email: ${email}\n\nQuest Details:\n${message}`;
      window.location.href = `mailto:koushik22work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSending(false);
      setSent(true);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2000);
      setTimeout(() => setSent(false), 3000);
    }, 800);
  };

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto mb-20">

      {/* Header */}
      <div
        ref={headerRef}
        className="text-center mb-16"
        style={{
          transform: headerInView ? "translateY(0)" : "translateY(24px)",
          opacity: headerInView ? 1 : 0,
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
        }}
      >
        <div
          className={`inline-block px-6 py-2 rounded-full border-2 border-dashed
            ${COLORS.orange.border} ${COLORS.orange.text} font-black uppercase tracking-widest text-sm
            bg-opacity-10 ${COLORS.orange.bg} mb-4 animate-bounce hover:animate-none
            hover:scale-105 transition-transform cursor-default`}
        >
          ✎ New Quest Available
        </div>
        <h2 className={`text-3xl md:text-5xl font-black uppercase ${currentTheme.text}`}>
          Get In Touch
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Contact Info */}
        <div
          ref={leftRef}
          className="lg:col-span-5"
          style={{
            transform: leftInView ? "translateX(0)" : "translateX(-32px)",
            opacity: leftInView ? 1 : 0,
            transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
          }}
        >
          <Card color="purple" className="h-full flex flex-col justify-center">
            <div className={`flex items-center gap-2 ${COLORS.purple.text} font-black uppercase tracking-widest text-xs mb-4`}>
              <Zap size={16} className="animate-flicker" /> Side Quest
            </div>
            <h2 className={`text-3xl font-black ${currentTheme.text} mb-4`}>Let's Team Up!</h2>
            <p className={`${currentTheme.textMuted} font-medium mb-8`}>
              Looking for a party member for your next adventure? Whether it's a freelance project,
              full-time position, or just want to say hi — I'm always ready for new quests!
            </p>

            <div className="space-y-6 mb-8">
              {/* Email row */}
              <div
                className="flex items-center gap-4 group cursor-default"
                onClick={() => navigator.clipboard?.writeText("koushik22work@gmail.com")}
                title="Click to copy"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-opacity-10 ${COLORS.purple.bg} flex items-center justify-center ${COLORS.purple.text}
                    border border-dashed ${COLORS.purple.border}
                    transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}
                >
                  <Mail size={24} />
                </div>
                <div>
                  <p className={`text-xs font-bold ${currentTheme.textMuted} uppercase`}>Email</p>
                  <p className={`font-bold ${currentTheme.text} group-hover:${COLORS.purple.text} transition-colors`}>
                    koushik22work@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative stat blocks */}
            <div className={`grid grid-cols-3 gap-3 pt-6 border-t-2 border-dashed ${currentTheme.inputBorder}`}>
              {[
                { label: "Response", val: "< 24h" },
                { label: "Projects", val: "20+"   },
                { label: "XP",       val: "12k"   },
              ].map(({ label, val }, i) => (
                <div
                  key={i}
                  className={`text-center p-3 rounded-xl ${currentTheme.inputBg} border border-dashed ${currentTheme.inputBorder}
                    hover:scale-105 hover:border-[#9B5DE5] transition-all duration-200 cursor-default`}
                >
                  <div className={`text-lg font-black ${COLORS.purple.text}`}>{val}</div>
                  <div className={`text-[10px] font-bold ${currentTheme.textMuted} uppercase`}>{label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Contact Form */}
        <div
          ref={rightRef}
          className="lg:col-span-7"
          style={{
            transform: rightInView ? "translateX(0)" : "translateX(32px)",
            opacity: rightInView ? 1 : 0,
            transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.5s ease 0.1s",
          }}
        >
          <Card color="teal">
            {/* Form header */}
            <div className={`flex items-center justify-between ${COLORS.teal.text} font-black uppercase tracking-widest text-xs mb-6`}>
              <div className="flex items-center gap-2">
                <Send size={16} /> Send Message
              </div>
              <button
                type="button"
                onClick={generateQuestBrief}
                disabled={isDrafting || !message}
                className={`flex items-center gap-1 text-[10px] bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold
                  hover:bg-indigo-600 hover:scale-105 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  transition-all duration-200`}
              >
                <Sparkles size={12} className={isDrafting ? "animate-spin" : ""} />
                {isDrafting ? "Drafting..." : "Scribe Quest"}
              </button>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSendEmail}>
              <FloatingInput
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              <FloatingInput
                label="Your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <FloatingInput
                label="Your Message"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your quest..."
              />

              {/* Submit button */}
              <div className="relative">
                <XPReward show={showXP} />
                <button
                  type="submit"
                  disabled={sending || !name || !email || !message}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest
                    border-2 border-[#1A1A1A] transition-all duration-200
                    flex items-center justify-center gap-2 mt-4 relative overflow-hidden
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${sent
                      ? "bg-green-500 text-white shadow-[4px_4px_0px_0px_#1A1A1A]"
                      : `${COLORS.teal.bg} text-white shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-[3px] active:shadow-none`
                    }`}
                >
                  {/* Shimmer on hover */}
                  <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : sent ? (
                    <>✓ Quest Dispatched!</>
                  ) : (
                    <><Send size={20} /> Send Message</>
                  )}
                </button>
              </div>
            </form>

            {/* XP hint */}
            <div className={`mt-6 flex items-center justify-center gap-2 text-xs font-bold ${COLORS.orange.text}`}>
              <Zap size={14} fill="currentColor" className="animate-flicker" />
              Complete this quest to earn{" "}
              <span className={`${COLORS.orange.text} font-black`}>+100 XP</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
