import { useState, useRef, useEffect } from "react";
import {
  Layers, Cpu, Radio, Sparkles, Terminal, Code2,
  Boxes, Zap, Wrench, GitBranch, Flame, CheckCircle2, ShieldCheck
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle } from "../components/UI";
import { playClick, playHover } from "../utils/soundFX";

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
  }, [threshold]);
  return [ref, inView];
}

const SKILL_BRANCHES = [
  {
    id: "engines",
    category: "Game Engines & Core Frameworks",
    icon: Layers,
    color: "teal",
    skills: [
      {
        name: "Unity 3D / 2D Engine",
        icon: Layers,
        capabilities: ["Physics Tuning", "Addressables", "DOTS / ECS", "Object Pooling"]
      },
    ]
  },
  {
    id: "systems",
    category: "Programming & Architecture",
    icon: Cpu,
    color: "purple",
    skills: [
      {
        name: "C# / Game Architecture",
        icon: Terminal,
        capabilities: ["Memory Optimization", "GC Minimization", "Custom Editors", "State Machines", "Async Operations"]
      },
      {
        name: "C++ Native Development",
        icon: Code2,
        capabilities: ["Pointers & Memory", "Data Structures", "Low-level Optimization", "Algorithm Tuning"]
      },
    ]
  },
  {
    id: "multiplayer",
    category: "Multiplayer & Networking",
    icon: Radio,
    color: "orange",
    skills: [
      {
        name: "Photon Fusion & Netcode",
        icon: Radio,
        capabilities: ["Server Authority", "Client Prediction", "Lag Compensation", "Matchmaking Queues", "Anti-Cheat"]
      },
      {
        name: "Sockets & REST APIs",
        icon: GitBranch,
        capabilities: ["TCP / UDP Sync", "Custom Data Serialization", "Backend Integration", "Leaderboards"]
      }
    ]
  },
  {
    id: "graphics",
    category: "AR & Hardware Integration",
    icon: Sparkles,
    color: "pink",
    skills: [
      {
        name: "AR & Hardware Integration",
        icon: Sparkles,
        capabilities: ["AR Foundation", "Kinect & LiDAR", "Niantic Lightship", "Real-World Tracking"]
      },
    ]
  }
];

const SkillNodeCard = ({ skill, branchColor, delay }) => {
  const { currentTheme } = useTheme();
  const [ref, inView] = useInView(0.1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;
  const colorObj = COLORS[branchColor] || COLORS.teal;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -10;
    setTilt({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setHovered(true); playHover(); }}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        transform: inView
          ? hovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
            : "perspective(800px) rotateX(0) rotateY(0) translateY(0)"
          : "translateY(24px) scale(0.96)",
        opacity: inView ? 1 : 0,
        transition: hovered
          ? "transform 0.1s ease, opacity 0.4s ease"
          : `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, opacity 0.4s ease ${delay}ms`,
      }}
      className={`p-6 rounded-2xl border-[3px] border-dashed ${colorObj.border} ${currentTheme.cardBg}
        shadow-[6px_6px_0px_0px_#1A1A1A] relative group overflow-hidden transition-all duration-200 cursor-pointer`}
    >
      {/* Holographic Light Sheen on Hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Skill Card Header */}
      <div className="flex items-center justify-between gap-3.5 mb-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl ${colorObj.bg} bg-opacity-20 ${colorObj.text} border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]
            group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
          >
            <Icon size={26} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9F1C] flex items-center gap-1">
              <ShieldCheck size={12} /> VERIFIED ABILITY
            </span>
            <h4 className={`text-xl font-black ${currentTheme.text} leading-tight`}>
              {skill.name}
            </h4>
          </div>
        </div>
      </div>

      {/* Capabilities / Specializations list */}
      <div className="pt-3 border-t-2 border-dashed border-gray-700/20 relative z-10">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
          Capabilities & Core Tech:
        </span>
        <div className="flex flex-wrap gap-2">
          {skill.capabilities.map((cap, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${currentTheme.inputBg} ${currentTheme.text} border border-gray-700/30 flex items-center gap-1.5
                group-hover:border-[#2EC4B6]/60 hover:scale-105 hover:bg-[#2EC4B6]/20 transition-all duration-200 shadow-sm`}
            >
              <CheckCircle2 size={13} className={colorObj.text} />
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
  const [activeTab, setActiveTab] = useState("all");

  const filteredBranches = activeTab === "all"
    ? SKILL_BRANCHES
    : SKILL_BRANCHES.filter(b => b.id === activeTab);

  return (
    <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Abilities & Stack" title="Skill Tree" colorClass={COLORS.teal.text} />

      {/* Branch Selector Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => { playClick(); setActiveTab("all"); }}
          onMouseEnter={playHover}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A] transition-all
            ${activeTab === "all"
              ? "bg-[#F15BB5] text-white shadow-[4px_4px_0px_0px_#1A1A1A]"
              : `${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10 shadow-[2px_2px_0px_0px_#1A1A1A]`}`}
        >
          All Branches
        </button>
        {SKILL_BRANCHES.map((b) => {
          const TabIcon = b.icon;
          const isActive = activeTab === b.id;
          return (
            <button
              key={b.id}
              onClick={() => { playClick(); setActiveTab(b.id); }}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1A1A1A] transition-all flex items-center gap-2
                ${isActive
                  ? "bg-[#2EC4B6] text-black shadow-[4px_4px_0px_0px_#1A1A1A]"
                  : `${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10 shadow-[2px_2px_0px_0px_#1A1A1A]`}`}
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
          const colorObj = COLORS[branch.color] || COLORS.teal;

          return (
            <div key={branch.id} className="space-y-6">
              {/* Branch Header */}
              <div className="flex items-center gap-3 border-b-2 border-dashed border-gray-700/30 pb-3">
                <div className={`p-2 rounded-xl ${colorObj.bg} bg-opacity-20 ${colorObj.text}`}>
                  <BranchIcon size={24} />
                </div>
                <h3 className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight`}>
                  {branch.category}
                </h3>
              </div>

              {/* Skills Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {branch.skills.map((skill, idx) => (
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
