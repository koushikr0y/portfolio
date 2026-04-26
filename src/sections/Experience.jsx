import { useRef, useState, useEffect } from "react";
import { Trophy, Briefcase, MapPin, Calendar, Star, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Card, Badge } from "../components/UI";
import { JOBS } from "../data/portfolioData";

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

// Smooth accordion with auto-height
const Accordion = ({ open, children }) => {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    setHeight(open ? innerRef.current.scrollHeight : 0);
  }, [open]);

  return (
    <div
      style={{
        height: `${height}px`,
        overflow: "hidden",
        transition: "height 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
};

const ExperienceCard = ({ job, idx }) => {
  const { currentTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [ref, inView] = useInView(0.1);

  return (
    <div
      ref={ref}
      style={{
        transform: inView ? "translateX(0)" : idx % 2 === 0 ? "translateX(-32px)" : "translateX(32px)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${idx * 100}ms, opacity 0.5s ease ${idx * 100}ms`,
      }}
    >
      <Card color={job.color} className="group transition-all">

        {/* Clickable header */}
        <div className="cursor-pointer" onClick={() => setExpanded((e) => !e)}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">

            {/* Icon + title */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border-2 border-dashed ${COLORS[job.color].border}
                transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                {idx === 0
                  ? <Trophy size={24} className={COLORS[job.color].text} />
                  : <Briefcase size={24} className={COLORS[job.color].text} />
                }
              </div>
              <div>
                <h3 className={`text-xl md:text-2xl font-black ${currentTheme.text}`}>{job.title}</h3>
                <div className={`flex flex-wrap items-center gap-3 text-sm font-bold ${currentTheme.textMuted} mt-1`}>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {job.date}</span>
                </div>
              </div>
            </div>

            {/* XP + status */}
            <div className="flex flex-col md:items-end gap-1 w-full md:w-auto">
              <div className="flex justify-between w-full md:w-auto items-center gap-4">
                <span className={`font-black text-lg ${COLORS[job.color].text}`}>{job.xp}</span>
                <Badge color={job.color} filled={job.status === "ACTIVE"}>{job.status}</Badge>
              </div>
            </div>
          </div>

          {/* Description + chevron */}
          <div className="flex justify-between items-center">
            <p className={`${currentTheme.textMuted} font-medium leading-relaxed border-l-4 ${currentTheme.inputBorder} pl-4 py-1 flex-1`}>
              {job.desc}
            </p>
            <button
              className={`ml-4 p-2 rounded-full ${currentTheme.inputBg} transition-all duration-300
                hover:scale-110 active:scale-95`}
            >
              <ChevronDown
                size={20}
                className={`${currentTheme.text} transition-transform duration-350 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Smooth accordion */}
        <Accordion open={expanded}>
          {job.achievements.length > 0 && (
            <div className={`mt-6 ${currentTheme.inputBg} rounded-lg p-4 border border-dashed ${currentTheme.inputBorder}`}>
              <h4 className={`font-black text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-3 flex items-center gap-2`}>
                <Star size={12} /> Key Achievements
              </h4>
              <ul className="space-y-2">
                {job.achievements.map((ach, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm font-bold ${currentTheme.text}`}
                    style={{
                      animationDelay: `${i * 60}ms`,
                      animation: expanded ? "slide-left 0.3s ease both" : "none",
                    }}
                  >
                    <span className={`${COLORS.orange.text} mt-1`}>✦</span> {ach}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Accordion>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mt-6">
          {job.stack.map((tech) => (
            <Badge key={tech} color={job.color}>{tech}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Experience = () => {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <SectionTitle subtitle="Quest Log" title="Experience" colorClass={COLORS.purple.text} />
      <div className="space-y-8">
        {JOBS.map((job, idx) => (
          <ExperienceCard key={idx} job={job} idx={idx} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
