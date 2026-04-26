import { useRef, useState, useEffect } from "react";
import { Layers, Cpu, PenTool } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Card, SkillBar } from "../components/UI";

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

// Animated SP counter
function SPCounter({ target, color, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);

  return (
    <span className={`font-black ${COLORS[color].text}`}>
      {count} SP
    </span>
  );
}

const SkillCard = ({ color, icon: Icon, title, skills, sp, delay }) => {
  const { currentTheme } = useTheme();
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} style={{
      transform: inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.96)",
      opacity: inView ? 1 : 0,
      transition: `transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.45s ease ${delay}ms`,
    }}>
      <Card color={color} className="h-full">
        <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
          <div className={`p-2 bg-opacity-10 ${COLORS[color].bg} rounded-lg ${COLORS[color].text}
            transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
            <Icon size={24} />
          </div>
          <h3 className={`text-xl font-black ${currentTheme.text}`}>{title}</h3>
        </div>

        {skills.map((s, i) => (
          <SkillBar key={s.name} name={s.name} level={s.level} color={color} delay={i * 120} />
        ))}

        <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
          <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
          <SPCounter target={sp} color={color} inView={inView} />
        </div>
      </Card>
    </div>
  );
};

const Skills = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Abilities" title="Skill Tree" colorClass={COLORS.teal.text} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SkillCard
          color="teal" icon={Layers} title="Game Engines" sp={425} delay={0}
          skills={[
            { name: "Unity",  level: 92 },
            { name: "Godot",  level: 85 },
          ]}
        />
        <SkillCard
          color="purple" icon={Cpu} title="Programming" sp={442} delay={100}
          skills={[
            { name: "C++",    level: 92 },
            { name: "C#",     level: 90 },
            { name: "Python", level: 85 },
          ]}
        />
        <SkillCard
          color="pink" icon={PenTool} title="Game Design" sp={350} delay={200}
          skills={[
            { name: "Level Design",   level: 70 },
            { name: "Systems Design", level: 78 },
          ]}
        />
      </div>
    </section>
  );
};

export default Skills;
