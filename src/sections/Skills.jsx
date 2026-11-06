import { useState, useRef, useEffect } from "react";
import {
  Layers,
  Cpu,
  Radio,
  Sparkles,
  Terminal,
  Code2,
  Boxes,
  Zap,
  Wrench,
  GitBranch,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Gamepad2,
  Monitor,
  Database,
  Server,
  Code,
  Laptop,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle } from "../components/UI";
import { playClick, playHover } from "../utils/soundFX";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { DEFAULT_SKILLS } from "../data/portfolioData";

export const SKILL_ICONS = {
  Layers,
  Cpu,
  Radio,
  Sparkles,
  Terminal,
  Code2,
  Boxes,
  Zap,
  Wrench,
  GitBranch,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Gamepad2,
  Monitor,
  Database,
  Server,
  Code,
  Laptop,
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const SkillNodeCard = ({ skill, branchColor, delay }) => {
  const { currentTheme } = useTheme();
  const [ref, inView] = useInView(0.1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const Icon =
    typeof skill.icon === "string"
      ? SKILL_ICONS[skill.icon] || Sparkles
      : skill.icon || Sparkles;
  const colorObj = COLORS[branchColor] || COLORS.teal;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
    setTilt({ x, y });
  };

  return (
    <div
      ref={ref}
      className="group relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setHovered(true);
        playHover();
      }}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{
        transform: inView
          ? hovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : "perspective(800px) rotateX(0) rotateY(0) translateY(0)"
          : "translateY(24px) scale(0.96)",
        opacity: inView ? 1 : 0,
        transition: hovered
          ? "transform 0.12s ease, opacity 0.4s ease"
          : `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.4s ease ${delay}ms`,
      }}
    >
      {/* Offset shadow div matching ProjectCard */}
      <div
        className={`absolute inset-0 bg-black/20 rounded-2xl transition-transform duration-200
        ${hovered ? "translate-x-3 translate-y-3" : "translate-x-2 translate-y-2"}`}
      />

      {/* Card Container matching ProjectCard */}
      <div
        className={`relative ${currentTheme.cardBg} border-[3px] border-dashed ${colorObj.border} rounded-2xl overflow-hidden p-6`}
      >
        {/* Holographic Light Sheen on Hover */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Skill Card Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2.5 rounded-xl ${colorObj.bg} bg-opacity-20 ${colorObj.text} border border-dashed ${colorObj.border}`}
          >
            <Icon size={22} />
          </div>
          <div>
            <h4
              className={`text-lg font-black ${currentTheme.text} uppercase tracking-tight`}
            >
              {skill.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 size={13} />
              <span>Skill Node Unlocked</span>
            </div>
          </div>
        </div>

        {/* Capabilities List */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t-2 border-dashed border-gray-700/20">
          {(skill.capabilities || []).map((cap, i) => (
            <span
              key={i}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${currentTheme.inputBg} ${currentTheme.text} border border-dashed ${currentTheme.inputBorder}
                transition-all duration-200 hover:scale-105 hover:border-[#2EC4B6]`}
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const { currentTheme } = useTheme();
  const { skills } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState("all");

  const rawBranches =
    skills && skills.length > 0 ? skills : DEFAULT_SKILLS;

  const branches = rawBranches.map((b) => ({
    ...b,
    icon:
      typeof b.icon === "string"
        ? SKILL_ICONS[b.icon] || Layers
        : b.icon || Layers,
    skills: (b.skills || []).map((s) => ({
      ...s,
      icon:
        typeof s.icon === "string"
          ? SKILL_ICONS[s.icon] || Sparkles
          : s.icon || Sparkles,
    })),
  }));

  const filteredBranches =
    activeCategory === "all"
      ? branches
      : branches.filter((b) => b.id === activeCategory);

  return (
    <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle
        subtitle="Skill Tree"
        title="Abilities & Masteries"
        colorClass={COLORS.teal.text}
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => {
            playClick();
            setActiveCategory("all");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A] transition-all
            ${
              activeCategory === "all"
                ? "bg-[#2EC4B6] text-black shadow-[3px_3px_0px_0px_#1A1A1A] -translate-y-0.5"
                : `${currentTheme.cardBg} ${currentTheme.text} shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-white/10`
            }`}
        >
          All Branches
        </button>
        {branches.map((b) => {
          const TabIcon = b.icon;
          return (
            <button
              key={b.id}
              onClick={() => {
                playClick();
                setActiveCategory(b.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A] transition-all flex items-center gap-2
                ${
                  activeCategory === b.id
                    ? `${COLORS[b.color || "teal"].bg} text-black shadow-[3px_3px_0px_0px_#1A1A1A] -translate-y-0.5`
                    : `${currentTheme.cardBg} ${currentTheme.text} shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-white/10`
                }`}
            >
              <TabIcon size={15} />
              {b.category.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Skill Branches Render */}
      <div className="space-y-12">
        {filteredBranches.map((branch) => {
          const BranchIcon = branch.icon;
          const colorObj = COLORS[branch.color || "teal"] || COLORS.teal;

          return (
            <div key={branch.id} className="space-y-6">
              {/* Branch Header */}
              <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-700/30 pb-3">
                <div
                  className={`p-2 rounded-xl ${colorObj.bg} bg-opacity-20 ${colorObj.text}`}
                >
                  <BranchIcon size={24} />
                </div>
                <h3
                  className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight`}
                >
                  {branch.category}
                </h3>
              </div>

              {/* Skills Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(branch.skills || []).map((skill, idx) => (
                  <SkillNodeCard
                    key={skill.name}
                    skill={skill}
                    branchColor={branch.color}
                    delay={idx * 120}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
