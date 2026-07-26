import { useState, useEffect, useRef } from "react";
import { Star, ExternalLink, Github, Gamepad2, Play, Smartphone, Apple, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Badge } from "../components/UI";
import { ALL_PROJECTS } from "../data/portfolioData";
import { playOpen, playHover } from "../utils/soundFX";

function useInView(threshold = 0.08) {
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

const getThumbnailStyle = (project) => {
  if (project.thumbnailImage)
    return { backgroundImage: `url(${project.thumbnailImage})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: project.cardGradient };
};

// Tilt-on-hover card
const ProjectCard = ({ p, idx, onSelect }) => {
  const { currentTheme } = useTheme();
  const [ref, inView] = useInView(0.08);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    const y = ((e.clientX - rect.left) / rect.width  - 0.5) * -8;
    setTilt({ x, y });
  };

  const col = (idx % 3) - 1; // -1, 0, 1

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        transform: inView
          ? hovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : "perspective(800px) rotateX(0) rotateY(0) translateY(0)"
          : `translateY(32px) translateX(${col * 16}px)`,
        opacity: inView ? 1 : 0,
        transition: hovered
          ? "transform 0.12s ease, opacity 0.5s ease"
          : "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
        transitionDelay: inView ? `${(idx % 3) * 80}ms` : "0ms",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
    >
      {/* Offset shadow */}
      <div className={`absolute inset-0 ${
          currentTheme.text === "text-[#E0E0E0]" ? "bg-white/10" : "bg-black/10"
        } rounded-2xl transition-transform duration-200
        ${hovered ? "translate-x-3 translate-y-3" : "translate-x-2 translate-y-2"}`}
      />

      <div className={`relative ${currentTheme.cardBg} border-[3px] border-dashed ${COLORS[p.color].border} rounded-2xl overflow-hidden`}>
        {/* Thumbnail */}
        <div className="h-48 relative overflow-hidden" style={getThumbnailStyle(p)}>
          <div className="absolute top-4 left-4"><Badge color={p.color} filled>{p.rarity}</Badge></div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-bold shadow-sm">
            <Star size={12} className="text-[#FF9F1C] fill-[#FF9F1C]" /> {p.rating}
          </div>
          {p.youtubeId && (
            <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
              <Play size={10} fill="white" /> VIDEO
            </div>
          )}
          {/* Hover overlay */}
          <div className={`absolute inset-0 flex items-center justify-center
            transition-all duration-300
            ${hovered ? "opacity-100 backdrop-blur-[2px] bg-black/40" : "opacity-0"}`}>
            <button
              onClick={() => { playOpen(); onSelect(p); }}
              className={`bg-white text-[#1A1A1A] px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs
                border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#000]
                transition-transform duration-200
                ${hovered ? "scale-100" : "scale-90"}`}
            >
              View Details
            </button>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6">
          <h3 className={`text-xl font-black ${currentTheme.text} mb-1`}>{p.title}</h3>
          
          {/* Platform indicators */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {p.androidUrl && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase flex items-center gap-1" title="Android">
                <Smartphone size={10} /> Android
              </span>
            )}
            {p.iosUrl && (
              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-black uppercase flex items-center gap-1" title="iOS">
                <Apple size={10} /> iOS
              </span>
            )}
            {p.webUrl && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase flex items-center gap-1" title="Web">
                <Globe size={10} /> Web
              </span>
            )}
            {p.steamUrl && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase flex items-center gap-1" title="Steam">
                <Gamepad2 size={10} /> Steam
              </span>
            )}
            {p.githubUrl && (
              <span className="px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-400 border border-gray-500/20 text-[10px] font-black uppercase flex items-center gap-1" title="GitHub Source">
                <Github size={10} /> GitHub
              </span>
            )}
          </div>

          <p className={`text-sm ${currentTheme.textMuted} font-medium mb-4 line-clamp-2`}>{p.desc}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.tags.map((t) => (
              <span key={t} className={`text-[10px] font-bold px-2 py-1 ${currentTheme.inputBg} rounded ${currentTheme.textMuted} border ${currentTheme.inputBorder}
                transition-transform duration-150 hover:scale-105`}>
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => onSelect(p)}
            className={`w-full py-2 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2
              ${COLORS[p.color].border} ${COLORS[p.color].text} border-2 border-dashed
              hover:scale-[1.02] hover:shadow-md active:scale-95
              transition-all duration-200`}
          >
            View Details <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Projects = ({ onSelectProject }) => {
  const [showAll, setShowAll] = useState(false);

  const INITIAL_PROJECT_COUNT = 6;
  const visibleProjects = showAll ? ALL_PROJECTS : ALL_PROJECTS.slice(0, INITIAL_PROJECT_COUNT);

  return (
    <section id="projects" className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Achievements Unlocked" title="Projects" colorClass={COLORS.pink.text} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleProjects.map((p, i) => (
          <ProjectCard key={p.id} p={p} idx={i} onSelect={onSelectProject} />
        ))}
      </div>

      {/* Show more/less */}
      {ALL_PROJECTS.length > INITIAL_PROJECT_COUNT && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`${COLORS.pink.bg} text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest
              border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]
              hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A]
              active:translate-y-[3px] active:shadow-none
              transition-all duration-150`}
          >
            {showAll ? "Show Less" : "Show More Projects"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
