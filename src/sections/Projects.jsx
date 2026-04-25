import { useState, useEffect } from "react";
import { Star, ExternalLink, Github, Gamepad2, Sparkles, X, Play, Image } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Badge } from "../components/UI";
import { model } from "../config/gemini";
import { ALL_PROJECTS } from "../data/portfolioData";

// -------------------------------------------------------------------
// Helper: convert a YouTube video ID → embeddable URL with autoplay
// -------------------------------------------------------------------
const getYoutubeEmbedUrl = (youtubeId) =>
  `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`;

// -------------------------------------------------------------------
// Helper: build the card thumbnail background style.
// Prefers a real image URL; falls back to the CSS gradient.
// -------------------------------------------------------------------
const getThumbnailStyle = (project) => {
  if (project.thumbnailImage) {
    return {
      backgroundImage: `url(${project.thumbnailImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { background: project.cardGradient };
};

// -------------------------------------------------------------------
// Sub-component: Media area inside the modal.
// Shows YouTube embed if youtubeId is set, otherwise shows the
// first previewImage, otherwise falls back to the card gradient.
// -------------------------------------------------------------------
const ModalMedia = ({ project }) => {
  if (project.youtubeId) {
    return (
      <div className="w-full aspect-video bg-black relative border-b-2 border-dashed border-gray-700/50">
        <iframe
          width="100%"
          height="100%"
          src={getYoutubeEmbedUrl(project.youtubeId)}
          title={`${project.title} — Video`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>
    );
  }

  // No video — show first preview image or gradient banner
  const fallbackSrc = project.previewImages?.[0] ?? null;
  return (
    <div
      className="w-full aspect-video border-b-2 border-dashed border-gray-700/50 flex items-center justify-center"
      style={
        fallbackSrc
          ? {
              backgroundImage: `url(${fallbackSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: project.cardGradient }
      }
    >
      {!fallbackSrc && (
        <div className="flex flex-col items-center gap-2 opacity-40">
          <Image size={40} className="text-white" />
          <span className="text-white text-xs font-bold uppercase tracking-widest">No Preview</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------------
// Sub-component: Preview thumbnails sidebar inside the modal.
// Renders previewImages array; falls back to gradient swatches.
// -------------------------------------------------------------------
const PreviewSidebar = ({ project, currentTheme }) => {
  const images = project.previewImages ?? [];

  // Show up to 4 slots; pad with nulls if fewer images
  const slots = [...images, null, null, null, null].slice(0, 4);

  return (
    <div
      className={`w-full lg:w-64 flex-shrink-0 ${currentTheme.inputBg} rounded-xl p-4 border-2 border-dashed ${currentTheme.inputBorder}`}
    >
      <h4 className={`text-xs font-bold uppercase ${currentTheme.textMuted} mb-3`}>
        Screenshots
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {slots.map((src, i) => (
          <div
            key={i}
            className="h-24 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity"
            style={
              src
                ? {
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    background: project.cardGradient,
                    filter: i % 2 === 1 ? "hue-rotate(60deg)" : "none",
                  }
            }
          >
            {src && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />}
            {!src && (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Image size={20} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// Main Projects Section
// -------------------------------------------------------------------
const Projects = () => {
  const { currentTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [lore, setLore] = useState("");
  const [generatingLore, setGeneratingLore] = useState(false);

  // const visibleProjects = showAll ? ALL_PROJECTS : ALL_PROJECTS.slice(0, 6);
  const INITIAL_PROJECT_COUNT = 6;

const visibleProjects = showAll
  ? ALL_PROJECTS
  : ALL_PROJECTS.slice(0, INITIAL_PROJECT_COUNT);

  // --- Gemini: Generate magical lore for a project ---
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

  // --- Modal close: reset all modal state ---
  const closeModal = () => {
    setSelectedProject(null);
    setLore("");
    setGeneratingLore(false);
  };

  // --- Scroll lock while modal is open ---
  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Achievements Unlocked" title="Projects" colorClass={COLORS.pink.text} />

      {/* ── Project Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleProjects.map((p) => (
          <div key={p.id} className="group relative">

            {/* Offset shadow layer */}
            <div
              className={`absolute inset-0 ${
                currentTheme.text === "text-[#E0E0E0]" ? "bg-white/10" : "bg-black/10"
              } rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform`}
            />

            <div
              className={`relative ${currentTheme.cardBg} border-[3px] border-dashed ${COLORS[p.color].border} rounded-2xl overflow-hidden transition-transform group-hover:-translate-y-1`}
            >
              {/* Thumbnail — real image or gradient from portfolioData */}
              <div className="h-48 relative overflow-hidden" style={getThumbnailStyle(p)}>
                <div className="absolute top-4 left-4">
                  <Badge color={p.color} filled>{p.rarity}</Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-bold shadow-sm">
                  <Star size={12} className="text-[#FF9F1C] fill-[#FF9F1C]" /> {p.rating}
                </div>

                {/* YouTube badge shown on the card if video exists */}
                {p.youtubeId && (
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                    <Play size={10} fill="white" /> VIDEO
                  </div>
                )}

                {/* Hover overlay → open modal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <button
                    onClick={() => setSelectedProject(p)}
                    className="bg-white text-[#1A1A1A] px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs border-2 border-[#1A1A1A] hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_#000]"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className={`text-xl font-black ${currentTheme.text} mb-2`}>{p.title}</h3>
                <p className={`text-sm ${currentTheme.textMuted} font-medium mb-4 line-clamp-2`}>
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] font-bold px-2 py-1 ${currentTheme.inputBg} rounded ${currentTheme.textMuted} border ${currentTheme.inputBorder}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProject(p)}
                  className={`w-full py-2 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${COLORS[p.color].border} ${COLORS[p.color].text} border-2 border-dashed hover:bg-opacity-10 hover:${COLORS[p.color].bg} transition-colors`}
                >
                  View Details <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      <div className="mt-12 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className={`${COLORS.pink.bg} text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all`}
        >
          {showAll ? "Show Less" : "Show More Projects"}
        </button>
      </div>

      {/* ── Project Detail Modal ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div className="flex min-h-full items-start justify-center p-4 md:items-center">
            <div
              className={`${currentTheme.cardBg} w-full max-w-4xl text-left rounded-2xl shadow-2xl border-4 border-dashed ${COLORS.pink.border} overflow-hidden relative animate-in zoom-in-95 duration-200 my-8`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`flex justify-between items-center p-4 border-b-2 border-dashed ${COLORS.pink.border} ${currentTheme.inputBg}`}
              >
                <span className={`font-black uppercase tracking-widest text-sm ${COLORS.pink.text} flex items-center gap-2`}>
                  <Gamepad2 size={18} /> Quest Details
                </span>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${currentTheme.text}`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Media: YouTube embed OR image OR gradient — from portfolioData */}
              <ModalMedia project={selectedProject} />

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* Left: Project Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge color={selectedProject.color} filled>{selectedProject.rarity}</Badge>
                      <span className={`flex items-center gap-1 font-bold ${COLORS.orange.text} text-sm`}>
                        <Star size={14} fill="currentColor" /> {selectedProject.rating} Rating
                      </span>
                    </div>

                    <h2 className={`text-3xl font-black ${currentTheme.text} mb-4`}>
                      {selectedProject.title}
                    </h2>
                    {/* <p className={`${currentTheme.textMuted} font-medium leading-relaxed mb-6`}>
                      {selectedProject.desc}
                    </p> */}
                    <p className={`${currentTheme.textMuted} font-medium leading-relaxed mb-6 whitespace-pre-line`}>
                      {selectedProject.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.tags.map((t) => (
                        <Badge key={t} color="gray">{t}</Badge>
                      ))}
                    </div>

                    {/* Arcane Lore (Gemini-powered) */}
                    <div
                      className={`mb-6 p-4 rounded-xl border-2 border-dashed ${COLORS.purple.border} bg-opacity-5 ${COLORS.purple.bg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-xs font-black uppercase ${COLORS.purple.text} flex items-center gap-2`}>
                          <Sparkles size={14} /> Arcane Lore
                        </h4>
                        {!lore && !generatingLore && (
                          <button
                            onClick={generateLore}
                            className="text-xs font-bold underline hover:text-[#9B5DE5] transition-colors"
                          >
                            ✨ Reveal Lore
                          </button>
                        )}
                      </div>
                      {generatingLore ? (
                        <div className="animate-pulse text-sm text-gray-400">
                          Consulting the ancient scrolls...
                        </div>
                      ) : lore ? (
                        <p className={`text-sm italic ${currentTheme.text} animate-in fade-in`}>
                          "{lore}"
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Unlock the magical history of this artifact...
                        </p>
                      )}
                    </div>

                    {/* Action Buttons — rendered as <a> if URL exists, disabled <button> if null */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {selectedProject.demoUrl ? (
                        <a
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 ${COLORS.pink.bg} text-white py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center justify-center gap-2`}
                        >
                          <Gamepad2 size={20} /> Play Demo
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-3 rounded-xl font-black uppercase border-2 border-dashed border-gray-400 text-gray-400 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                        >
                          <Gamepad2 size={20} /> No Demo Yet
                        </button>
                      )}

                      {selectedProject.githubUrl ? (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 ${currentTheme.cardBg} ${currentTheme.text} py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-dashed ${
                            currentTheme.text === "text-[#E0E0E0]" ? "border-gray-500" : "border-[#1A1A1A]"
                          } hover:opacity-80 transition-all flex items-center justify-center gap-2`}
                        >
                          <Github size={20} /> Source Code
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-3 rounded-xl font-black uppercase border-2 border-dashed border-gray-400 text-gray-400 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                        >
                          <Github size={20} /> Private Repo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Screenshots — from previewImages in portfolioData */}
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
