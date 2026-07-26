import { useState, useEffect } from "react";
import { ArrowLeft, Star, Smartphone, Apple, Globe, Github, Gamepad2, X, Play, Image, ChevronLeft, ChevronRight, Maximize2, AlertTriangle, CheckCircle2, Cpu, ExternalLink, Sparkles, Compass, Briefcase, Clock, Layers, Users, Share2, QrCode } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { Badge } from "./UI";
import { ALL_PROJECTS } from "../data/portfolioData";
import { playSuccess } from "../utils/soundFX";
import QRCodeModal from "./QRCodeModal";

const getYoutubeEmbedUrl = (id) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;

const ProjectDetailView = ({ project, onBack, onSelectProject }) => {
  const { currentTheme } = useTheme();
  const [showQR, setShowQR] = useState(false);

  // Set default active media
  const [activeMedia, setActiveMedia] = useState(() => {
    if (project.youtubeId) {
      return { type: "video", src: project.youtubeId };
    } else if (project.previewImages && project.previewImages.length > 0) {
      return { type: "image", src: project.previewImages[0], index: 0 };
    }
    return { type: "none", src: null };
  });

  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Update active media and scroll to top whenever selected project changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (project.youtubeId) {
      setActiveMedia({ type: "video", src: project.youtubeId });
    } else if (project.previewImages && project.previewImages.length > 0) {
      setActiveMedia({ type: "image", src: project.previewImages[0], index: 0 });
    } else {
      setActiveMedia({ type: "none", src: null });
    }
  }, [project]);

  // Keyboard controls for Lightbox
  useEffect(() => {
    if (lightboxIndex === null || !project.previewImages) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => 
          prev < project.previewImages.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => 
          prev > 0 ? prev - 1 : project.previewImages.length - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, project]);

  // Sidebar items list
  const mediaItems = [];
  if (project.youtubeId) {
    mediaItems.push({ type: "video", src: project.youtubeId, thumb: `https://img.youtube.com/vi/${project.youtubeId}/0.jpg` });
  }
  if (project.previewImages) {
    project.previewImages.forEach((img, idx) => {
      mediaItems.push({ type: "image", src: img, index: idx });
    });
  }

  // Pad with empty slots to ensure we have at least 4 items for grid consistency
  const slots = [...mediaItems];
  while (slots.length < 4) {
    slots.push(null);
  }

  const hasAnyLink = project.androidUrl || project.iosUrl || project.webUrl || project.steamUrl || project.githubUrl;

  // Next & Prev Project Calculation
  const currentIndex = ALL_PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? ALL_PROJECTS[currentIndex - 1] : ALL_PROJECTS[ALL_PROJECTS.length - 1];
  const nextProject = currentIndex < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[currentIndex + 1] : ALL_PROJECTS[0];

  const [copied, setCopied] = useState(false);

  const handleShareLink = () => {
    try {
      playSuccess();
    } catch (e) {}
    const shareUrl = `${window.location.origin}${window.location.pathname}#project-${project.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`min-h-screen py-24 px-4 ${currentTheme.bg} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Back navigation & Share Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2
              border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] bg-[#F15BB5] hover:bg-[#eb4aa9] text-white
              hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A]
              active:translate-y-[3px] active:shadow-none
              transition-all duration-150`}
          >
            <ArrowLeft size={16} /> Back to Quests
          </button>

          <button
            onClick={handleShareLink}
            className={`px-4 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center gap-2
              border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]
              ${copied ? "bg-emerald-500 text-white" : `${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10`}
              hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A]
              active:translate-y-0.5 active:shadow-none transition-all duration-150`}
          >
            {copied ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
            <span>{copied ? "Link Copied!" : "Share Quest Link"}</span>
          </button>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge color={project.color} filled>{project.rarity} ITEM</Badge>
              {project.rating && (
                <span className={`flex items-center gap-1 font-bold ${COLORS.orange.text} text-sm bg-white/5 px-2 py-0.5 rounded-lg border border-orange-500/10`}>
                  <Star size={14} fill="currentColor" className="text-[#FF9F1C]" /> {project.rating} Rating
                </span>
              )}
            </div>
            <h1 className={`text-4xl md:text-5xl font-black ${currentTheme.text} uppercase tracking-tight`}>
              {project.title}
            </h1>
          </div>
        </div>

        {/* Quick Launch & Redirect Toolbar */}
        {hasAnyLink && (
          <div className={`mb-8 p-4 rounded-2xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm`}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#F15BB5]">
              <Sparkles size={16} /> Direct Game & Build Redirects
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {(project.androidUrl || project.iosUrl) && (
                <button
                  onClick={() => setShowQR(true)}
                  className="bg-[#FF9F1C] hover:bg-[#e88c0c] text-black py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group cursor-pointer"
                  title="Scan QR Code to test on Mobile"
                >
                  <QrCode size={15} /> <span>Scan Mobile QR</span>
                </button>
              )}
              {project.androidUrl && (
                <a
                  href={project.androidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2EC4B6] hover:bg-[#20ab9d] text-black py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group"
                >
                  <Smartphone size={15} /> <span>Play on Android</span> <ExternalLink size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.iosUrl && (
                <a
                  href={project.iosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#007AFF] hover:bg-[#0062cc] text-white py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group"
                >
                  <Apple size={15} /> <span>App Store</span> <ExternalLink size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.webUrl && (
                <a
                  href={project.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF9F1C] hover:bg-[#e88c0c] text-black py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group"
                >
                  <Globe size={15} /> <span>Play Online (Web)</span> <ExternalLink size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.steamUrl && (
                <a
                  href={project.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1b2838] hover:bg-[#121c27] text-white py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group"
                >
                  <Gamepad2 size={15} /> <span>Steam</span> <ExternalLink size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2 px-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] ${currentTheme.cardBg} ${currentTheme.text} hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 group`}
                >
                  <Github size={15} /> <span>Source Code</span> <ExternalLink size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Project Key Metrics & Specifications Grid */}
        {project.metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} shadow-sm space-y-1`}>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#F15BB5]">
                <Briefcase size={14} /> Role
              </div>
              <p className={`text-xs sm:text-sm font-bold ${currentTheme.text} truncate`}>
                {project.metrics.role}
              </p>
            </div>

            <div className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} shadow-sm space-y-1`}>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#2EC4B6]">
                <Clock size={14} /> Duration
              </div>
              <p className={`text-xs sm:text-sm font-bold ${currentTheme.text} truncate`}>
                {project.metrics.duration}
              </p>
            </div>

            <div className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} shadow-sm space-y-1`}>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FF9F1C]">
                <Layers size={14} /> Engine / Tech
              </div>
              <p className={`text-xs sm:text-sm font-bold ${currentTheme.text} truncate`}>
                {project.metrics.engine}
              </p>
            </div>

            <div className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} shadow-sm space-y-1`}>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-400">
                <Users size={14} /> Team Size
              </div>
              <p className={`text-xs sm:text-sm font-bold ${currentTheme.text} truncate`}>
                {project.metrics.teamSize}
              </p>
            </div>
          </div>
        )}

        {/* Main Grid: Preview & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Showcase (Left 2 Columns) */}
          <div className="lg:col-span-2">
            {activeMedia.type === "video" && (
              <div className={`w-full h-[300px] sm:h-[400px] md:h-[480px] bg-black rounded-2xl overflow-hidden border-[3px] border-dashed ${COLORS[project.color].border} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] relative`}>
                <iframe
                  width="100%"
                  height="100%"
                  src={getYoutubeEmbedUrl(activeMedia.src)}
                  title={`${project.title} — Video Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
            )}
            {activeMedia.type === "image" && (
              <div
                onClick={() => setLightboxIndex(activeMedia.index)}
                className={`w-full h-[300px] sm:h-[400px] md:h-[480px] bg-black/60 rounded-2xl overflow-hidden cursor-zoom-in group relative border-[3px] border-dashed ${COLORS[project.color].border} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] flex items-center justify-center`}
              >
                {/* Glassmorphic blurred image background to avoid empty bars */}
                <img
                  src={activeMedia.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 select-none pointer-events-none"
                />

                {/* Foreground uncropped screenshot */}
                <img
                  src={activeMedia.src}
                  alt={`${project.title} Viewport`}
                  className="relative max-w-full max-h-full object-contain z-10 transition-transform duration-500 group-hover:scale-[1.01]"
                />

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 z-20">
                  <div className="bg-black/75 backdrop-blur-sm text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl border border-white/10">
                    <Maximize2 size={14} /> Fullscreen Zoom
                  </div>
                </div>
              </div>
            )}
            {activeMedia.type === "none" && (
              <div className={`w-full h-[300px] sm:h-[400px] md:h-[480px] rounded-2xl flex flex-col items-center justify-center border-[3px] border-dashed ${COLORS[project.color].border} bg-white/5`}>
                <Image size={48} className={`opacity-40 ${currentTheme.text}`} />
                <span className={`text-xs font-bold uppercase tracking-widest opacity-40 ${currentTheme.text} mt-2`}>No Preview Available</span>
              </div>
            )}
          </div>

          {/* Screenshot Sidebar Selector (Right 1 Column) */}
          <div className={`rounded-2xl p-5 border-[3px] border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]`}>
            <h3 className={`text-sm font-black uppercase ${currentTheme.textMuted} mb-4 flex items-center gap-2`}>
              <Cpu size={16} /> Screenshot Gallery
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {slots.map((item, i) => {
                if (!item) {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="h-24 rounded-xl overflow-hidden border-2 border-dashed border-gray-700/20 flex items-center justify-center opacity-20"
                      style={{ background: project.cardGradient, filter: i % 2 === 1 ? "hue-rotate(60deg)" : "none" }}
                    >
                      <Image size={20} className="text-white" />
                    </div>
                  );
                }

                const isActive = activeMedia && activeMedia.type === item.type &&
                  (item.type === "video" ? activeMedia.src === item.src : activeMedia.index === item.index);

                const borderClass = isActive
                  ? `border-4 ${COLORS[project.color].border} shadow-[0_0_12px_rgba(241,91,181,0.4)] scale-[1.02]`
                  : `border-2 border-transparent hover:scale-[1.02] hover:opacity-90`;

                return (
                  <div
                    key={`${item.type}-${i}`}
                    onClick={() => setActiveMedia(item)}
                    className={`h-24 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-200 ${borderClass}`}
                    style={item.type === "video"
                      ? { backgroundImage: `url(${item.thumb})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { backgroundImage: `url(${item.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    {item.type === "video" && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <div className="bg-red-600 text-white rounded-full p-2.5 shadow-lg">
                          <Play size={14} fill="white" className="ml-0.5" />
                        </div>
                        <span className="absolute bottom-1.5 left-2 text-[9px] font-black text-white uppercase tracking-wider bg-black/75 px-2 py-0.5 rounded">
                          Trailer
                        </span>
                      </div>
                    )}
                    {item.type === "image" && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50">
                        <span className="absolute bottom-1.5 left-2 text-[9px] font-black text-white uppercase tracking-wider bg-black/75 px-2 py-0.5 rounded">
                          Screen {item.index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="space-y-8">
          {/* Overview / Contribution Card */}
          <div className={`p-6 md:p-8 rounded-2xl border-[3px] border-dashed ${COLORS[project.color].border} ${currentTheme.cardBg} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]`}>
            <h2 className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight mb-4`}>
              Quest Overview
            </h2>
            <div className={`${currentTheme.textMuted} font-medium leading-relaxed mb-6 whitespace-pre-line text-sm md:text-base`}>
              {project.desc}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-gray-700/20">
              {project.tags.map((t) => (
                <Badge key={t} color="gray">{t}</Badge>
              ))}
            </div>
          </div>

          {/* Quest Log: Challenges & Resolutions */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight flex items-center gap-2`}>
                ⚔️ Quest Log: Challenges & Resolutions
              </h2>

              <div className="space-y-6">
                {project.challenges.map((c, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-dashed border-gray-600/40 space-y-4">
                    {/* Timeline node */}
                    <div className={`absolute left-[-9px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-[#1A1A1A] ${COLORS[project.color].bg} shadow-md`} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Difficulty Card */}
                      <div className={`p-5 rounded-xl border-2 border-[#E24A35]/30 bg-[#E24A35]/5 shadow-sm space-y-2`}>
                        <h4 className="text-[#E24A35] font-black uppercase text-xs tracking-wider flex items-center gap-1.5">
                          <AlertTriangle size={14} /> Challenge {i + 1}: The Obstacle
                        </h4>
                        <p className={`text-sm ${currentTheme.text} font-medium leading-relaxed`}>
                          {c.problem}
                        </p>
                      </div>

                      {/* Resolution Card */}
                      <div className={`p-5 rounded-xl border-2 border-[#2EC4B6]/30 bg-[#2EC4B6]/5 shadow-sm space-y-2`}>
                        <h4 className="text-[#2EC4B6] font-black uppercase text-xs tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Resolution: Objective Complete
                        </h4>
                        <p className={`text-sm ${currentTheme.text} font-medium leading-relaxed`}>
                          {c.resolution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Carousel: Prev & Next Quest */}
        <div className="mt-16 pt-8 border-t-2 border-dashed border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-sm font-black uppercase ${currentTheme.textMuted} tracking-widest flex items-center gap-2`}>
              <Compass size={18} className="text-[#F15BB5]" /> Continue the Journey
            </h3>
            <span className={`text-xs font-bold ${currentTheme.textMuted} opacity-60`}>
              Quest {currentIndex + 1} of {ALL_PROJECTS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous Project Card */}
            <button
              onClick={() => onSelectProject && onSelectProject(prevProject)}
              className={`p-4 md:p-5 rounded-2xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg}
                hover:border-[#F15BB5] shadow-[4px_4px_0px_0px_#1A1A1A] text-left group
                hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none
                transition-all duration-200 flex items-center gap-4`}
            >
              <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#F15BB5] group-hover:scale-110 transition-all flex-shrink-0">
                <ChevronLeft size={22} />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                  ← Previous Quest
                </span>
                <h4 className={`text-base font-black ${currentTheme.text} truncate group-hover:text-[#F15BB5] transition-colors`}>
                  {prevProject.title}
                </h4>
              </div>
            </button>

            {/* Next Project Card */}
            <button
              onClick={() => onSelectProject && onSelectProject(nextProject)}
              className={`p-4 md:p-5 rounded-2xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg}
                hover:border-[#F15BB5] shadow-[4px_4px_0px_0px_#1A1A1A] text-right group
                hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none
                transition-all duration-200 flex items-center justify-end gap-4`}
            >
              <div className="overflow-hidden">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                  Next Quest →
                </span>
                <h4 className={`text-base font-black ${currentTheme.text} truncate group-hover:text-[#F15BB5] transition-colors`}>
                  {nextProject.title}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#F15BB5] group-hover:scale-110 transition-all flex-shrink-0">
                <ChevronRight size={22} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && project.previewImages && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X size={28} />
          </button>

          {project.previewImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : project.previewImages.length - 1));
              }}
              className="absolute left-4 md:left-8 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {project.previewImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev < project.previewImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 md:right-8 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div className="max-w-[90vw] max-h-[80vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={project.previewImages[lightboxIndex]}
              alt={`${project.title} screenshot`}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10 shadow-2xl"
            />
            <div className="mt-4 text-sm font-bold text-white/60 uppercase tracking-widest">
              Screenshot {lightboxIndex + 1} of {project.previewImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Mobile QR Scanner Modal for Desktop recruiters */}
      {showQR && (
        <QRCodeModal project={project} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
};

export default ProjectDetailView;
