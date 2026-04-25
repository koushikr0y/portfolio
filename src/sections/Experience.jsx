import { useState } from "react";
import { Trophy, Briefcase, MapPin, Calendar, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Card, Badge } from "../components/UI";
import { JOBS } from "../data/portfolioData";

// --- Experience Section (Quest Log) ---
const Experience = () => {
  const { currentTheme } = useTheme();
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleJob = (idx) => {
    setExpandedJobs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <SectionTitle subtitle="Quest Log" title="Experience" colorClass={COLORS.purple.text} />

      <div className="space-y-8">
        {JOBS.map((job, idx) => (
          <Card key={idx} color={job.color} className="group transition-all">

            {/* Clickable Header */}
            <div className="cursor-pointer" onClick={() => toggleJob(idx)}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">

                {/* Left: Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border-2 border-dashed ${COLORS[job.color].border}`}>
                    {idx === 0 ? (
                      <Trophy size={24} className={COLORS[job.color].text} />
                    ) : (
                      <Briefcase size={24} className={COLORS[job.color].text} />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl md:text-2xl font-black ${currentTheme.text}`}>
                      {job.title}
                    </h3>
                    <div className={`flex flex-wrap items-center gap-3 text-sm font-bold ${currentTheme.textMuted} mt-1`}>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {job.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: XP + Status */}
                <div className="flex flex-col md:items-end gap-1 w-full md:w-auto">
                  <div className="flex justify-between w-full md:w-auto items-center gap-4">
                    <span className={`font-black text-lg ${COLORS[job.color].text}`}>{job.xp}</span>
                    <Badge color={job.color} filled={job.status === "ACTIVE"}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description + Expand Toggle */}
              <div className="flex justify-between items-center">
                <p className={`${currentTheme.textMuted} font-medium leading-relaxed border-l-4 ${currentTheme.inputBorder} pl-4 py-1 flex-1`}>
                  {job.desc}
                </p>
                <button
                  className={`ml-4 p-2 rounded-full ${currentTheme.inputBg} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                >
                  {expandedJobs[idx] ? (
                    <ChevronUp size={20} className={currentTheme.text} />
                  ) : (
                    <ChevronDown size={20} className={currentTheme.text} />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded: Achievements */}
            {expandedJobs[idx] && job.achievements.length > 0 && (
              <div
                className={`mt-6 ${currentTheme.inputBg} rounded-lg p-4 border border-dashed ${currentTheme.inputBorder} animate-in slide-in-from-top-2 duration-200`}
              >
                <h4
                  className={`font-black text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-3 flex items-center gap-2`}
                >
                  <Star size={12} /> Key Achievements
                </h4>
                <ul className="space-y-2">
                  {job.achievements.map((ach, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm font-bold ${currentTheme.text}`}>
                      <span className={`${COLORS.orange.text} mt-1`}>✦</span> {ach}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2 mt-6">
              {job.stack.map((tech) => (
                <Badge key={tech} color={job.color}>{tech}</Badge>
              ))}
            </div>
          </Card>
        ))}

        {/* Total XP Summary (commented out) */}
        {/* <div className={`${currentTheme.cardBg} border-[3px] border-dashed ${COLORS.orange.border} rounded-2xl p-4 text-center shadow-lg transform rotate-1`}>
          <span className={`font-bold ${currentTheme.textMuted} text-xs uppercase tracking-[0.2em] mb-1 block`}>Total Experience Points Earned</span>
          <span className={`font-black text-4xl ${COLORS.orange.text}`}>+12,000 XP</span>
        </div> */}
      </div>
    </section>
  );
};

export default Experience;
