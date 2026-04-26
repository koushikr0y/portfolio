import { useState, useEffect, useRef } from "react";
import { Star, ExternalLink, Github, Gamepad2, Sparkles, X, Play, Image } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Badge } from "../components/UI";
import { model } from "../config/gemini";
import { ALL_PROJECTS } from "../data/portfolioData";

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

const getYoutubeEmbedUrl = (id) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;

const getThumbnailStyle = (project) => {
  if (project.thumbnailImage)
    return { backgroundImage: `url(${project.thumbnailImage})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: project.cardGradient };
};

const ModalMedia = ({ project }) => {
  if (project.youtubeId) {
    return (
      <div className="w-full aspect-video bg-black relative border-b-2 border-dashed border-gray-700/50">
        <iframe width="100%" height="100%" src={getYoutubeEmbedUrl(project.youtubeId)}
          title={`${project.title} — Video`} frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen className="absolute inset-0" />
      </div>
    );
  }
  const fallbackSrc = project.previewImages?.[0] ?? null;
  return (
    <div className="w-full aspect-video border-b-2 border-dashed border-gray-700/50 flex items-center justify-center"
      style={fallbackSrc
        ? { backgroundImage: `url(${fallbackSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: project.cardGradient }}>
      {!fallbackSrc && (
        <div className="flex flex-col items-center gap-2 opacity-40">
          <Image size={40} className="text-white" />
          <span className="text-white text-xs font-bold uppercase tracking-widest">No Preview</span>
        </div>
      )}
    </div>
  );
};

const PreviewSidebar = ({ project, currentTheme }) => {
  const images = project.previewImages ?? [];
  const slots = [...images, null, null, null, null].slice(0, 4);
  return (
    <div className={`w-full lg:w-64 flex-shrink-0 ${currentTheme.inputBg} rounded-xl p-4 border-2 border-dashed ${currentTheme.inputBorder}`}>
      <h4 className={`text-xs font-bold uppercase ${currentTheme.textMuted} mb-3`}>Screenshots</h4>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {slots.map((src, i) => (
          <div key={i}
            className="h-24 rounded-lg overflow-hidden relative cursor-pointer hover:scale-[1.03] hover:opacity-90 transition-all duration-200"
            style={src
              ? { backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: project.cardGradient, filter: i % 2 === 1 ? "hue-rotate(60deg)" : "none" }}>
            {src && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />}
            {!src && <div className="absolute inset-0 flex items-center justify-center opacity-30"><Image size={20} className="text-white" /></div>}
          </div>
        ))}
      </div>
    </div>
  );
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
              onClick={() => onSelect(p)}
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
          <h3 className={`text-xl font-black ${currentTheme.text} mb-2`}>{p.title}</h3>
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

const Projects = () => {
  const { currentTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [lore, setLore] = useState("");
  const [generatingLore, setGeneratingLore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const INITIAL_PROJECT_COUNT = 6;
  const visibleProjects = showAll ? ALL_PROJECTS : ALL_PROJECTS.slice(0, INITIAL_PROJECT_COUNT);

  const openModal = (p) => {
    setSelectedProject(p);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => { setSelectedProject(null); setLore(""); setGeneratingLore(false); }, 280);
  };

  const generateLore = async () => {
    if (!selectedProject || generatingLore) return;
    setGeneratingLore(true);
    setLore("");
    try {
      const prompt = `Write a short, exciting RPG item description (max 40 words) for a legendary artifact named "${selectedProject.title}". It was forged using ${selectedProject.tags.join(", ")}. Use magical metaphors for the tech.`;
      const result = await model.generateContent(prompt);
      setLore(result.response.text());
    } catch (e) {
      setLore("The ancient runes are unreadable at this time.");
    } finally {
      setGeneratingLore(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProject]);

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Achievements Unlocked" title="Projects" colorClass={COLORS.pink.text} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleProjects.map((p, i) => (
          <ProjectCard key={p.id} p={p} idx={i} onSelect={openModal} />
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

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm"
          style={{
            opacity: modalVisible ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
          onClick={closeModal}
        >
          <div className="flex min-h-full items-start justify-center p-4 md:items-center">
            <div
              className={`${currentTheme.cardBg} w-full max-w-4xl text-left rounded-2xl shadow-2xl border-4 border-dashed ${COLORS.pink.border} overflow-hidden relative my-8`}
              style={{
                transform: modalVisible ? "scale(1) translateY(0)" : "scale(0.92) translateY(20px)",
                transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`flex justify-between items-center p-4 border-b-2 border-dashed ${COLORS.pink.border} ${currentTheme.inputBg}`}>
                <span className={`font-black uppercase tracking-widest text-sm ${COLORS.pink.text} flex items-center gap-2`}>
                  <Gamepad2 size={18} /> Quest Details
                </span>
                <button onClick={closeModal}
                  className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-90 ${currentTheme.text}`}>
                  <X size={24} />
                </button>
              </div>

              <ModalMedia project={selectedProject} />

              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge color={selectedProject.color} filled>{selectedProject.rarity}</Badge>
                      <span className={`flex items-center gap-1 font-bold ${COLORS.orange.text} text-sm`}>
                        <Star size={14} fill="currentColor" /> {selectedProject.rating} Rating
                      </span>
                    </div>
                    <h2 className={`text-3xl font-black ${currentTheme.text} mb-4`}>{selectedProject.title}</h2>
                    <p className={`${currentTheme.textMuted} font-medium leading-relaxed mb-6 whitespace-pre-line`}>
                      {selectedProject.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.tags.map((t) => <Badge key={t} color="gray">{t}</Badge>)}
                    </div>

                    {/* Arcane Lore */}
                    <div className={`mb-6 p-4 rounded-xl border-2 border-dashed ${COLORS.purple.border} bg-opacity-5 ${COLORS.purple.bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-xs font-black uppercase ${COLORS.purple.text} flex items-center gap-2`}>
                          <Sparkles size={14} /> Arcane Lore
                        </h4>
                        {!lore && !generatingLore && (
                          <button onClick={generateLore}
                            className={`text-xs font-bold underline hover:${COLORS.purple.text} transition-colors hover:scale-105 active:scale-95`}>
                            ✨ Reveal Lore
                          </button>
                        )}
                      </div>
                      {generatingLore ? (
                        <div className="animate-pulse text-sm text-gray-400">Consulting the ancient scrolls...</div>
                      ) : lore ? (
                        <p className={`text-sm italic ${currentTheme.text}`} style={{ animation: "slide-up 0.4s ease both" }}>"{lore}"</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Unlock the magical history of this artifact...</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {selectedProject.demoUrl ? (
                        <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer"
                          className={`flex-1 ${COLORS.pink.bg} text-white py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A]
                            hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-[3px] active:shadow-none
                            transition-all flex items-center justify-center gap-2`}>
                          <Gamepad2 size={20} /> Play Demo
                        </a>
                      ) : (
                        <button disabled className="flex-1 py-3 rounded-xl font-black uppercase border-2 border-dashed border-gray-400 text-gray-400 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                          <Gamepad2 size={20} /> No Demo Yet
                        </button>
                      )}
                      {selectedProject.githubUrl ? (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                          className={`flex-1 ${currentTheme.cardBg} ${currentTheme.text} py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_#1A1A1A]
                            border-2 border-dashed ${currentTheme.text === "text-[#E0E0E0]" ? "border-gray-500" : "border-[#1A1A1A]"}
                            hover:opacity-80 hover:translate-y-[2px] transition-all flex items-center justify-center gap-2`}>
                          <Github size={20} /> Source Code
                        </a>
                      ) : (
                        <button disabled className="flex-1 py-3 rounded-xl font-black uppercase border-2 border-dashed border-gray-400 text-gray-400 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                          <Github size={20} /> Private Repo
                        </button>
                      )}
                    </div>
                  </div>

                  <PreviewSidebar project={selectedProject} currentTheme={currentTheme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
