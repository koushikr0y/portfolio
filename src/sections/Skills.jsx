import { Layers, Cpu, PenTool, Wrench } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { SectionTitle, Card, SkillBar } from "../components/UI";

// --- Skills Section (Skill Tree) ---
const Skills = () => {
  const { currentTheme } = useTheme();

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Abilities" title="Skill Tree" colorClass={COLORS.teal.text} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Game Engines */}
        <Card color="teal">
          <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
            <div className={`p-2 bg-opacity-10 ${COLORS.teal.bg} rounded-lg ${COLORS.teal.text}`}>
              <Layers size={24} />
            </div>
            <h3 className={`text-xl font-black ${currentTheme.text}`}>Game Engines</h3>
          </div>
          {/* <SkillBar name="Unreal Engine 5" level={95} color="teal" /> */}
          <SkillBar name="Unity"  level={92} color="teal" />
          <SkillBar name="Godot"  level={85} color="teal" />
          {/* <SkillBar name="Phaser.js" level={75} color="teal" /> */}
          <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
            <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
            <span className={`font-black ${COLORS.teal.text}`}>425 SP</span>
          </div>
        </Card>

        {/* Programming */}
        <Card color="purple">
          <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
            <div className={`p-2 bg-opacity-10 ${COLORS.purple.bg} rounded-lg ${COLORS.purple.text}`}>
              <Cpu size={24} />
            </div>
            <h3 className={`text-xl font-black ${currentTheme.text}`}>Programming</h3>
          </div>
          <SkillBar name="C++"    level={92} color="purple" />
          <SkillBar name="C#"     level={90} color="purple" />
          {/* <SkillBar name="TypeScript" level={95} color="purple" /> */}
          <SkillBar name="Python" level={85} color="purple" />
          <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
            <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
            <span className={`font-black ${COLORS.purple.text}`}>442 SP</span>
          </div>
        </Card>

        {/* Game Design */}
        <Card color="pink">
          <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
            <div className={`p-2 bg-opacity-10 ${COLORS.pink.bg} rounded-lg ${COLORS.pink.text}`}>
              <PenTool size={24} />
            </div>
            <h3 className={`text-xl font-black ${currentTheme.text}`}>Game Design</h3>
          </div>
          <SkillBar name="Level Design"   level={70} color="pink" />
          <SkillBar name="Systems Design" level={78} color="pink" />
          {/* <SkillBar name="Narrative" level={82} color="pink" /> */}
          <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
            <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
            <span className={`font-black ${COLORS.pink.text}`}>350 SP</span>
          </div>
        </Card>

        {/* Technical Art (commented out) */}
        {/* <Card color="orange">
          <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
            <div className={`p-2 bg-opacity-10 ${COLORS.orange.bg} rounded-lg ${COLORS.orange.text}`}>
              <Wrench size={24} />
            </div>
            <h3 className={`text-xl font-black ${currentTheme.text}`}>Technical Art</h3>
          </div>
          <SkillBar name="Shaders / HLSL" level={88} color="orange" />
          <SkillBar name="Optimization"   level={90} color="orange" />
          <SkillBar name="VFX Graph"      level={82} color="orange" />
          <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
            <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
            <span className={`font-black ${COLORS.orange.text}`}>390 SP</span>
          </div>
        </Card> */}

      </div>
    </section>
  );
};

export default Skills;
