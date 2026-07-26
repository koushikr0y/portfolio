import { useRef, useState, useEffect } from "react";
import { Trophy, Briefcase, MapPin, Calendar, Star, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Badge } from "../components/UI";
import { JOBS } from "../data/portfolioData";
import { playClick, playHover } from "../utils/soundFX";

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

// Smooth accordion
const Accordion = ({ open, children }) => {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  }, [open]);
  return (
    <div style={{ height: `${height}px`, overflow: "hidden", transition: "height 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
};

const ExperienceCard = ({ job, idx }) => {
  const { currentTheme } = useTheme();
  // Closed by default so first experience panel isn't open automatically
  const [expanded, setExpanded] = useState(false);
  const [ref, inView] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  const colorObj = COLORS[job.color] || COLORS.teal;

  return (
    <div
      ref={ref}
      className="group relative cursor-pointer mb-6"
      onMouseEnter={() => { setHovered(true); playHover(); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${idx * 100}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${idx * 100}ms`,
      }}
    >
      {/* Offset shadow div matching Projects & Skills cards */}
      <div className={`absolute inset-0 bg-black/20 rounded-2xl transition-transform duration-200
        ${hovered ? "translate-x-3 translate-y-3" : "translate-x-2 translate-y-2"}`}
      />

      {/* Card Body matching Skills & Projects */}
      <div
        className={`relative ${currentTheme.cardBg} border-[3px] border-dashed ${colorObj.border} rounded-2xl overflow-hidden p-5 sm:p-6
          transition-transform duration-200`}
        onClick={() => { playClick(); setExpanded((e) => !e); }}
      >
        {/* Holographic Sheen on Hover */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Active Quest Top Highlight */}
        {job.status === "ACTIVE" && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#2EC4B6] to-transparent" />
        )}

        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 mb-3 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl ${colorObj.bg} bg-opacity-20 ${colorObj.text} border ${currentTheme.cardBorder} shadow-sm
              group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
              {idx === 0
                ? <Trophy size={24} />
                : <Briefcase size={24} />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge color={job.color} filled={job.status === "ACTIVE"}>{job.status}</Badge>
                <span className={`text-[10px] font-black uppercase tracking-widest ${colorObj.text}`}>
                  {job.xp}
                </span>
              </div>
              <h3 className={`text-lg sm:text-xl font-black ${currentTheme.text} leading-tight`}>
                {job.title}
              </h3>
            </div>
          </div>

          {/* Chevron Accordion Icon */}
          <div className={`p-2 rounded-xl ${currentTheme.inputBg} border border-dashed ${currentTheme.inputBorder} flex-shrink-0 mt-1`}>
            <ChevronDown
              size={18}
              className={`${currentTheme.text} transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold ${currentTheme.textMuted} mb-3.5 relative z-10`}>
          <span className="flex items-center gap-1.5"><Briefcase size={13} className={colorObj.text} /> {job.company}</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
          <span className="flex items-center gap-1.5"><Calendar size={13} /> {job.date}</span>
        </div>

        {/* Description */}
        <p className={`text-sm ${currentTheme.textMuted} font-medium leading-relaxed border-l-2 border-dashed ${colorObj.border} pl-3 relative z-10`}>
          {job.desc}
        </p>

        {/* Achievements Accordion */}
        <Accordion open={expanded}>
          {job.achievements.length > 0 && (
            <div className={`mt-4 ${currentTheme.inputBg} rounded-xl p-4 border border-dashed ${currentTheme.inputBorder} relative z-10`}>
              <h4 className={`font-black text-[10px] uppercase tracking-wider ${currentTheme.textMuted} mb-3 flex items-center gap-2`}>
                <Star size={11} className={colorObj.text} /> Key Achievements
              </h4>
              <ul className="space-y-2">
                {job.achievements.map((ach, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm font-semibold ${currentTheme.text}`}>
                    <span className={`${colorObj.text} flex-shrink-0 mt-0.5`}>✦</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Accordion>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-dashed border-gray-700/20 relative z-10">
          {job.stack.map((tech) => (
            <Badge key={tech} color={job.color}>{tech}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-20 px-4 max-w-4xl mx-auto">
      <SectionTitle subtitle="Quest Log" title="Experience" colorClass={COLORS.purple.text} />
      <div className="space-y-2">
        {JOBS.map((job, idx) => (
          <ExperienceCard
            key={idx}
            job={job}
            idx={idx}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;
