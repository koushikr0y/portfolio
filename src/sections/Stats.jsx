import { useRef, useState, useEffect } from "react";
import { Code, Coffee, Trophy, Star, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Card } from "../components/UI";

const ICON_MAP = { Code, Coffee, Trophy, Star };

function useInView(threshold = 0.15) {
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

const Stats = () => {
  const { currentTheme } = useTheme();
  const [aboutRef, aboutInView] = useInView(0.1);

  const stats = [
    // { icon: "Code",   val: "20+", label: "Projects Completed", color: "teal" },
    // { icon: "Coffee", val: "∞",   label: "Cups of Coffee",     color: "pink" },
    // { icon: "Trophy", val: "12",  label: "Awards Won",         color: "orange" },
    // { icon: "Star",   val: "100+",label: "Happy Clients",      color: "purple" },
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Player Stats" title="Character Sheet" />

      {/* Stat Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => {
            const Icon = ICON_MAP[stat.icon];
            return (
              <Card key={i} color={stat.color} delay={i * 80}
                className="flex flex-col items-center text-center cursor-pointer">
                <Icon size={32} className={`mb-4 ${COLORS[stat.color].text}`} strokeWidth={2.5} />
                <h3 className={`text-4xl font-black ${currentTheme.text} mb-1`}>{stat.val}</h3>
                <p className={`text-sm font-bold ${currentTheme.textMuted} uppercase tracking-wide`}>
                  {stat.label}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      {/* About Me Card */}
      <div
        ref={aboutRef}
        style={{
          transform: aboutInView ? "translateY(0)" : "translateY(32px)",
          opacity: aboutInView ? 1 : 0,
          transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease",
        }}
      >
        <Card color="purple" className="flex flex-col md:flex-row gap-8 items-start p-8 md:p-12">
          <div className="flex-shrink-0">
            <div
              className={`w-16 h-16 rounded-full bg-opacity-10 ${COLORS.purple.bg} flex items-center justify-center ${COLORS.purple.text}
                transition-transform duration-500 hover:scale-110 hover:rotate-12`}
            >
              <Heart size={32} fill="currentColor" />
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-black ${currentTheme.text} mb-4 flex items-center gap-2`}>
              ★ ABOUT ME ★
            </h3>
            <div className={`space-y-4 ${currentTheme.textMuted} leading-relaxed font-medium`}>
              <p>
                A passionate game developer dedicated to creating captivating and immersive digital
                worlds. With over 3 years of experience in the game development industry, I specialize
                in designing and building engaging gameplay mechanics, stunning visuals, and seamless
                player experiences. When not developing games, I'm exploring the latest gaming
                technologies and enhancing my skills to push creative boundaries.
              </p>
              <p>
                I believe in writing clean, efficient code and crafting intuitive, fun gameplay that
                keeps players coming back. What began as curiosity has grown into a deep passion for
                innovation and problem-solving in the interactive entertainment space.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Stats;
