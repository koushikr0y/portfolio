import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  User, 
  Heart, 
  Code, 
  Trophy, 
  Star, 
  Coffee, 
  Zap, 
  MapPin, 
  Calendar, 
  Briefcase, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Send, 
  X,
  ChevronDown,
  ChevronUp,
  Play,
  Layers,
  Gamepad2,
  Cpu,
  PenTool,
  Wrench,
  Sun,
  Moon,
  Sparkles,
  MessageSquare,
  Bot,
  Scroll,
  Globe,
  Loader2
} from 'lucide-react';

// --- Gemini API Configuration ---
// TODO: Replace with your actual Gemini API Key
const apiKey = ""; 
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

// --- Theme Context & System ---

const ThemeContext = createContext();

const THEMES = {
  light: {
    bg: "bg-[#FFF9F0]",
    text: "text-[#1A1A1A]",
    textMuted: "text-gray-500",
    cardBg: "bg-white",
    cardBorder: "border-gray-200", 
    gridLine: "rgba(26, 26, 26, 0.05)",
    shadow: "rgba(26,26,26,1)",
    inputBg: "bg-gray-50",
    inputBorder: "border-gray-300",
  },
  dark: {
    bg: "bg-[#121212]",
    text: "text-[#E0E0E0]",
    textMuted: "text-gray-400",
    cardBg: "bg-[#1E1E1E]",
    cardBorder: "border-gray-700",
    gridLine: "rgba(255, 255, 255, 0.05)",
    shadow: "rgba(0,0,0,1)",
    inputBg: "bg-[#2A2A2A]",
    inputBorder: "border-[#404040]",
  }
};

const COLORS = {
  orange: { border: "border-[#FF9F1C]", text: "text-[#FF9F1C]", bg: "bg-[#FF9F1C]" },
  teal: { border: "border-[#2EC4B6]", text: "text-[#2EC4B6]", bg: "bg-[#2EC4B6]" },
  purple: { border: "border-[#9B5DE5]", text: "text-[#9B5DE5]", bg: "bg-[#9B5DE5]" },
  pink: { border: "border-[#F15BB5]", text: "text-[#F15BB5]", bg: "bg-[#F15BB5]" },
  gray: { border: "border-gray-400", text: "text-gray-400", bg: "bg-gray-400" }
};

const useTheme = () => useContext(ThemeContext);

// --- Data for Gemini Context ---
const PORTFOLIO_DATA = {
  name: "Koushik Roy",
  level: 42,
  class: "Game Developer",
  skills: {
    engines: ["Unreal Engine 5", "Unity", "Godot", "Phaser.js"],
    languages: ["C++", "C#", "Python"],
    design: ["Level Design", "Systems Design", "Narrative"],
    technical: ["Shaders", "Optimization", "VFX Graph"]
  },
  jobs: [
    { company: "Epic Game Studios", role: "Lead Game Developer", desc: "Built AAA multiplayer games." },
    { company: "Indie Dreams", role: "Senior Programmer", desc: "Indie physics and AI systems." }
  ],
  projects: [
    { title: "Neon Odyssey", type: "Cyberpunk Action RPG" },
    { title: "Pixel Dungeons", type: "Roguelike" },
    { title: "Speed Demons", type: "Racing" }
  ]
};

// --- Reusable Components ---

const SectionTitle = ({ subtitle, title, colorClass }) => {
  const { theme, currentTheme } = useTheme();
  return (
    <div className="text-center mb-12">
      <div className={`text-xs font-bold tracking-[0.2em] uppercase mb-2 flex items-center justify-center gap-2 ${currentTheme.textMuted}`}>
        {subtitle}
      </div>
      <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tight relative inline-block ${colorClass || currentTheme.text}`} 
          style={{ textShadow: theme === 'light' ? '4px 4px 0px rgba(0,0,0,0.1)' : '4px 4px 0px rgba(0,0,0,0.5)' }}>
        {title}
      </h2>
    </div>
  );
};

const Card = ({ children, className = "", color = "orange", dashed = true, onClick }) => {
  const { currentTheme } = useTheme();
  const colorObj = COLORS[color] || COLORS.orange;
  
  return (
    <div 
      onClick={onClick}
      className={`${currentTheme.cardBg} rounded-2xl p-6 relative ${dashed ? 'border-[3px] border-dashed' : 'border-[3px] border-solid'} ${colorObj.border} transition-transform hover:-translate-y-1 ${className}`}
      style={{ boxShadow: `8px 8px 0px 0px ${currentTheme.shadow}` }}
    >
      {children}
    </div>
  );
};

const Badge = ({ children, color = "gray", filled = false }) => {
  const { theme } = useTheme();
  const c = COLORS[color] || COLORS.gray;
  
  const bgClass = filled ? c.bg : (theme === 'dark' ? `bg-opacity-10 ${c.bg}` : `bg-opacity-10 ${c.bg}`);
  const textClass = filled ? (theme === 'dark' ? 'text-black' : 'text-white') : c.text;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-dashed ${c.border} ${bgClass} ${textClass}`}>
      {children}
    </span>
  );
};

const SkillBar = ({ name, level, color = "teal" }) => {
  const { currentTheme } = useTheme();
  const c = COLORS[color] || COLORS.teal;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className={`font-bold text-sm ${currentTheme.text}`}>{name}</span>
        <span className={`font-bold text-xs ${c.text}`}>LVL {level}</span>
      </div>
      <div className={`h-4 w-full rounded-full border-2 overflow-hidden relative ${currentTheme.inputBg} ${currentTheme.inputBorder}`}>
        <div 
          className={`h-full ${c.bg} transition-all duration-1000 ease-out relative`}
          style={{ width: `${level}%` }}
        >
           <div className="absolute inset-0 opacity-30" 
                style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.25) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.25) 50%,rgba(255,255,255,.25) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Loading Screen Component ---

const LoadingScreen = ({ onComplete }) => {
  const { theme, currentTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Initializing World...");
  
  // Flavor text specifically for game dev portfolio
  const loadingTexts = [
    "Loading Assets...",
    "Compiling Shaders...",
    "Generating Terrain...",
    "Spawning Mobs...",
    "Polishing Pixels...",
    "Calibrating Physics...",
    "Readying Player One..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8; // Slightly faster but random increments
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small delay at 100% before clearing
          return 100;
        }
        // Change text occasionally
        if (Math.random() > 0.8) {
           setText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]); // Add dependency for safety

  return (
    // Updated styling to match "Paper Pop" aesthetic (Cream background, dashed borders)
    <div className={`fixed inset-0 ${currentTheme.bg} z-[9999] flex flex-col items-center justify-center p-4`}>
      {/* Background Grid Pattern specifically for loading screen */}
      <div 
         className="absolute inset-0 pointer-events-none opacity-[0.05]" 
         style={{ backgroundImage: `linear-gradient(${theme === 'light' ? '#1A1A1A' : '#FFF'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'light' ? '#1A1A1A' : '#FFF'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
      ></div>

      <div className="w-full max-w-sm relative z-10 text-center">
        {/* Animated Icon */}
        <div className="mb-8 animate-bounce">
           <Gamepad2 size={64} className="mx-auto text-[#FF9F1C]" strokeWidth={1.5} />
        </div>

        <div className={`mb-2 flex justify-between text-xs font-black tracking-widest ${currentTheme.text} uppercase font-mono`}>
          <span>{text}</span>
          <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>
        
        {/* Progress Bar Container - Dashed Border Style */}
        <div className={`h-8 ${currentTheme.cardBg} rounded-xl border-4 border-dashed ${theme === 'light' ? 'border-[#1A1A1A]' : 'border-gray-500'} overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(26,26,26,0.1)]`}>
          {/* Progress Fill - Striped Pattern */}
          <div 
            className="h-full bg-[#FF9F1C] transition-all duration-100 ease-out relative"
            style={{ width: `${progress}%` }}
          >
             {/* Stripes */}
             <div className="absolute inset-0 opacity-30" 
                  style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.25) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.25) 50%,rgba(255,255,255,.25) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Familiar (Chatbot) Component ---

const FamiliarChat = () => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Greetings, traveler! I am the digital familiar of Koushik Roy. Ask me anything about his skills, experience, or quests!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const systemPrompt = `
        You are a mystical Digital Familiar for Koushik Roy, a Level 42 Game Developer.
        Your tone is a mix of high-fantasy RPG and technical jargon (e.g., "I shall query the archives", "His mana pool of C++ is vast").
        Be helpful, concise, and enthusiastic.
        
        Here is John's data:
        ${JSON.stringify(PORTFOLIO_DATA)}
        
        Answer the user's question based on this data. If you don't know, say you need to consult the ancient scrolls (and you don't know).
      `;

      const result = await model.generateContent([
        systemPrompt,
        `User asked: ${userMsg}`
      ]);
      const response = result.response.text();
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "My connection to the ether is weak... (API Error)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-transform hover:scale-110 border-2 border-dashed ${COLORS.purple.border} ${COLORS.purple.bg} text-white`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-40 w-80 md:w-96 h-[500px] ${currentTheme.cardBg} rounded-2xl border-[3px] border-dashed ${COLORS.purple.border} shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300`}>
          <div className={`${COLORS.purple.bg} p-4 flex items-center gap-2 text-white`}>
            <Sparkles size={18} />
            <span className="font-black uppercase tracking-wider text-sm">Summoned Familiar</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-opacity-50 bg-black/5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm font-medium ${
                  m.role === 'user' 
                    ? `${COLORS.purple.bg} text-white rounded-br-none` 
                    : `${currentTheme.inputBg} ${currentTheme.text} border border-dashed ${currentTheme.inputBorder} rounded-bl-none`
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`${currentTheme.inputBg} p-3 rounded-xl rounded-bl-none border border-dashed ${currentTheme.inputBorder}`}>
                  <span className="animate-pulse text-xs text-gray-400">Consulting the archives...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`p-3 border-t-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg}`}>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about skills..."
                className={`flex-1 ${currentTheme.inputBg} border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9B5DE5] ${currentTheme.text}`}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={`${COLORS.purple.bg} text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- Sections ---

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="fixed top-0 right-0 p-6 z-50">
      <button 
        onClick={toggleTheme}
        className={`p-3 rounded-full border-2 border-dashed transition-transform hover:scale-110 ${theme === 'light' ? 'bg-white border-[#FF9F1C] text-[#FF9F1C]' : 'bg-[#1E1E1E] border-[#FF9F1C] text-[#FF9F1C]'}`}
        style={{ boxShadow: theme === 'light' ? '4px 4px 0px 0px rgba(26,26,26,0.2)' : '4px 4px 0px 0px rgba(0,0,0,0.5)' }}
      >
        {theme === 'light' ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
      </button>
    </div>
  );
};

const Hero = () => {
  const { currentTheme } = useTheme();
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Avatar */}
      <div className="relative mb-8 group cursor-pointer">
        <div className={`w-40 h-40 rounded-full ${currentTheme.cardBg} border-4 border-dashed ${COLORS.orange.border} p-2 relative z-10 shadow-[0px_0px_0px_8px_rgba(255,159,28,0.1)] group-hover:scale-105 transition-transform duration-300`}>
           <div className="w-full h-full bg-[#FFE5D9] rounded-full overflow-hidden relative flex items-center justify-center">
              <div className="w-full h-full absolute top-4">
                 <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Riley" alt="Avatar" className="w-full h-full object-cover" />
              </div>
           </div>
        </div>
        <div className={`absolute -bottom-2 -right-2 ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-full p-2 z-20`}>
          <Gamepad2 size={20} className={COLORS.purple.text} />
        </div>
      </div>

      <div className={`${COLORS.orange.text} text-xs font-bold tracking-[0.3em] uppercase mb-2 animate-pulse`}>
        ▶ Press Start ◀
      </div>

      <h1 className={`text-6xl md:text-8xl font-black ${currentTheme.text} tracking-tighter mb-4 text-center relative z-10`}
          style={{ textShadow: '6px 6px 0px #FF9F1C' }}>
        Koushik Roy
      </h1>

      <div className={`${currentTheme.cardBg} px-8 py-3 rounded-xl border-[3px] border-dashed ${COLORS.pink.border} shadow-[6px_6px_0px_rgba(241,91,181,0.2)] mb-8 transform -rotate-1 hover:rotate-0 transition-transform`}>
        <span className={`text-xl font-black ${COLORS.pink.text} tracking-widest`}>GAME DEVELOPER</span>
      </div>

      {/* Social Links Row */}
      <div className="flex gap-4 mb-10">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
           className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed ${currentTheme.text === 'text-[#E0E0E0]' ? 'border-gray-600' : 'border-[#1A1A1A]'} ${currentTheme.text} hover:scale-110 hover:${COLORS.purple.text} hover:${COLORS.purple.border} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
          <Github size={24} />
        </a>
        <a href="https://itch.io" target="_blank" rel="noopener noreferrer" 
           className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed ${currentTheme.text === 'text-[#E0E0E0]' ? 'border-gray-600' : 'border-[#1A1A1A]'} ${currentTheme.text} hover:scale-110 hover:${COLORS.orange.text} hover:${COLORS.orange.border} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
          <Gamepad2 size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
           className={`${currentTheme.cardBg} p-3 rounded-xl border-2 border-dashed ${currentTheme.text === 'text-[#E0E0E0]' ? 'border-gray-600' : 'border-[#1A1A1A]'} ${currentTheme.text} hover:scale-110 hover:${COLORS.teal.text} hover:${COLORS.teal.border} transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
          <Twitter size={24} />
        </a>
      </div>

      {/* Level Bar */}
      <div className={`${currentTheme.cardBg} p-2 rounded-xl border-[3px] border-dashed ${COLORS.teal.border} shadow-[6px_6px_0px_rgba(46,196,182,0.2)] w-full max-w-md flex items-center gap-4 transform rotate-1 hover:rotate-0 transition-transform`}>
         <div className="flex flex-col items-center px-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase">LVL</span>
            <span className={`text-2xl font-black ${currentTheme.text} leading-none`}>42</span>
         </div>
         <div className="flex-1">
            <div className={`h-4 ${currentTheme.inputBg} rounded-full overflow-hidden border ${currentTheme.inputBorder}`}>
               <div className={`h-full ${COLORS.teal.bg} w-[75%] relative`}>
                  <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_ease-in-out_infinite]"></div>
               </div>
            </div>
            <div className="flex justify-between mt-1">
               <span className="text-[10px] text-gray-400 font-bold">XP</span>
               <span className="text-[10px] text-gray-400 font-bold">12,450 / 15,000</span>
            </div>
         </div>
      </div>

      <div className="absolute bottom-10 animate-bounce">
         <div className={`w-12 h-12 rounded-full border-2 border-dashed ${COLORS.orange.border} flex items-center justify-center ${COLORS.orange.text}`}>
            <ChevronDown size={24} />
         </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const { currentTheme } = useTheme();
  const stats = [
    { icon: Code, val: "20+", label: "Projects Completed", color: "teal" },
    { icon: Coffee, val: "∞", label: "Cups of Coffee", color: "pink" },
    // { icon: Trophy, val: "12", label: "Awards Won", color: "orange" },
    // { icon: Star, val: "100+", label: "Happy Clients", color: "purple" },
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Player Stats" title="Character Sheet" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <Card key={i} color={stat.color} className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
             <stat.icon size={32} className={`mb-4 ${COLORS[stat.color].text}`} strokeWidth={2.5} />
             <h3 className={`text-4xl font-black ${currentTheme.text} mb-1`}>{stat.val}</h3>
             <p className={`text-sm font-bold ${currentTheme.textMuted} uppercase tracking-wide`}>{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card color="purple" className="flex flex-col md:flex-row gap-8 items-start p-8 md:p-12">
         <div className="flex-shrink-0">
            <div className={`w-16 h-16 rounded-full bg-opacity-10 ${COLORS.purple.bg} flex items-center justify-center ${COLORS.purple.text}`}>
               <Heart size={32} fill="currentColor" />
            </div>
         </div>
         <div>
            <h3 className={`text-2xl font-black ${currentTheme.text} mb-4 flex items-center gap-2`}>
               ★ ABOUT ME ★
            </h3>
            <div className={`space-y-4 ${currentTheme.textMuted} leading-relaxed font-medium`}>
               <p>
                  A passionate game developer dedicated to creating captivating and immersive digital worlds. With over 3 years of experience in the game development industry, I specialize in designing and building engaging gameplay mechanics, stunning visuals, and seamless player experiences. When not developing games, I’m exploring the latest gaming technologies and enhancing my skills to push creative boundaries.
               </p>
               <p>
                  I believe in writing clean, efficient code and crafting intuitive, fun gameplay that keeps players coming back. What began as curiosity has grown into a deep passion for innovation and problem-solving in the interactive entertainment space.
               </p>
            </div>
         </div>
      </Card>
    </section>
  );
};

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
           <SkillBar name="Unity" level={92} color="teal" />
           <SkillBar name="Godot" level={85} color="teal" />
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
           <SkillBar name="C++" level={92} color="purple" />
           <SkillBar name="C#" level={90} color="purple" />
           {/* {<SkillBar name="TypeScript" level={95} color="purple" /> } */}
           { <SkillBar name="Python" level={85} color="purple" />}
           <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
              <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
              <span className={`font-black ${COLORS.purple.text}`}>442 SP</span>
           </div>
        </Card>

        {/* Design */}
        <Card color="pink">
           <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
              <div className={`p-2 bg-opacity-10 ${COLORS.pink.bg} rounded-lg ${COLORS.pink.text}`}>
                 <PenTool size={24} />
              </div>
              <h3 className={`text-xl font-black ${currentTheme.text}`}>Game Design</h3>
           </div>
           <SkillBar name="Level Design" level={70} color="pink" />
           <SkillBar name="Systems Design" level={78} color="pink" />
           {/* <SkillBar name="Narrative" level={82} color="pink" /> */}
           <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
              <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
              <span className={`font-black ${COLORS.pink.text}`}>350 SP</span>
           </div>
        </Card>

         {/* Technical */}
         {/* <Card color="orange">
           <div className={`flex items-center gap-3 mb-6 border-b-2 border-dashed ${currentTheme.inputBorder} pb-4`}>
              <div className={`p-2 bg-opacity-10 ${COLORS.orange.bg} rounded-lg ${COLORS.orange.text}`}>
                 <Wrench size={24} />
              </div>
              <h3 className={`text-xl font-black ${currentTheme.text}`}>Technical Art</h3>
           </div>
           <SkillBar name="Shaders / HLSL" level={88} color="orange" />
           <SkillBar name="Optimization" level={90} color="orange" />
           <SkillBar name="VFX Graph" level={82} color="orange" />
           <div className={`mt-4 pt-4 border-t-2 border-dashed ${currentTheme.inputBorder} flex justify-between items-center`}>
              <span className={`text-xs font-bold ${currentTheme.textMuted}`}>Total Skill Points</span>
              <span className={`font-black ${COLORS.orange.text}`}>390 SP</span>
           </div>
        </Card> */}

      </div>
    </section>
  );
};

const Experience = () => {
  const { currentTheme } = useTheme();
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleJob = (idx) => {
    setExpandedJobs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const jobs = [
    {
      title: "Unity Game Developer",
      company: "Studio Krew",
      location: "Remote",
      date: "Aug 2023 - Present",
      status: "ACTIVE",
      xp: "+5000 XP",
      desc: "Leading development of multiplayer games, managing a team of 3 developers, and architecting game systems.",
      achievements: [
        "Built multiplayer systems handling 10K concurrent players",
        "Optimized code with code reviews and refactoring",
        "Mentored 1 junior developers"
      ],
      stack: ["Unity", "C#", "Sockets", "Multiplayer"],
      color: "orange"
    },
    {
      title: "Unity Gameplay Programmer",
      company: "Digital Jalebi",
      location: "Noida, India",
      date: "Dec 2022 - Jun 2023",
      status: "COMPLETED",
      xp: "+3500 XP",
      desc: "Core Gameplay programmer for events gamified applications. Specialized in Augmented Reality and mobile optimization.",
      achievements: [
        "Implemented different AR SDK(Niantic, Meta Spark, Vuforia, AR Foundation, Snapchat)",
        "Optimized physics gameplay for mobile to work with hardware",
      ],
      stack: ["Unity", "C#", "Procedural Gen", "Augmented Reality", "Kinect", "Lidar"],
      color: "purple"
    },
  ];

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <SectionTitle subtitle="Quest Log" title="Experience" colorClass={COLORS.purple.text} />
      
      <div className="space-y-8">
        {jobs.map((job, idx) => (
          <Card key={idx} color={job.color} className="group transition-all">
            <div className="cursor-pointer" onClick={() => toggleJob(idx)}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                   <div className={`p-3 rounded-xl border-2 border-dashed ${COLORS[job.color].border}`}>
                      {idx === 0 ? <Trophy size={24} className={COLORS[job.color].text} /> : <Briefcase size={24} className={COLORS[job.color].text} />}
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
                <div className="flex flex-col md:items-end gap-1 w-full md:w-auto">
                   <div className="flex justify-between w-full md:w-auto items-center gap-4">
                     <span className={`font-black text-lg ${COLORS[job.color].text}`}>{job.xp}</span>
                     <Badge color={job.color} filled={job.status === "ACTIVE"}>{job.status}</Badge>
                   </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                 <p className={`${currentTheme.textMuted} font-medium leading-relaxed border-l-4 ${currentTheme.inputBorder} pl-4 py-1 flex-1`}>
                    {job.desc}
                 </p>
                 <button className={`ml-4 p-2 rounded-full ${currentTheme.inputBg} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}>
                    {expandedJobs[idx] ? <ChevronUp size={20} className={currentTheme.text} /> : <ChevronDown size={20} className={currentTheme.text} />}
                 </button>
              </div>
            </div>

            {expandedJobs[idx] && job.achievements.length > 0 && (
              <div className={`mt-6 ${currentTheme.inputBg} rounded-lg p-4 border border-dashed ${currentTheme.inputBorder} animate-in slide-in-from-top-2 duration-200`}>
                <h4 className={`font-black text-xs uppercase tracking-wider ${currentTheme.textMuted} mb-3 flex items-center gap-2`}>
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

            <div className="flex flex-wrap gap-2 mt-6">
              {job.stack.map(tech => (
                <Badge key={tech} color={job.color}>{tech}</Badge>
              ))}
            </div>
          </Card>
        ))}
        
        {/* <div className={`${currentTheme.cardBg} border-[3px] border-dashed ${COLORS.orange.border} rounded-2xl p-4 text-center shadow-lg transform rotate-1`}>
           <span className={`font-bold ${currentTheme.textMuted} text-xs uppercase tracking-[0.2em] mb-1 block`}>Total Experience Points Earned</span>
           <span className={`font-black text-4xl ${COLORS.orange.text}`}>+12,000 XP</span>
        </div> */}
      </div>
    </section>
  );
};

const Projects = () => {
  const { currentTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [lore, setLore] = useState("");
  const [generatingLore, setGeneratingLore] = useState(false);

  const allProjects = [
    {
      id: 1,
      title: "Neon Odyssey",
      desc: "A cyberpunk action RPG with real-time combat, branching narratives, and procedurally generated cities.",
      tags: ["Unreal Engine 5", "C++", "Multiplayer"],
      rarity: "LEGENDARY",
      rating: "4.9",
      color: "orange",
      image: "linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 100%)"
    },
    {
      id: 2,
      title: "Pixel Dungeons",
      desc: "A roguelike dungeon crawler with hand-crafted pixel art, challenging boss fights, and hundreds of items.",
      tags: ["Unity", "C#", "Procedural Gen"],
      rarity: "EPIC",
      rating: "4.8",
      color: "purple",
      image: "linear-gradient(135deg, #2D1B69 0%, #1A103C 100%)"
    },
    {
      id: 3,
      title: "Speed Demons Racing",
      desc: "High-octane arcade racer with drift mechanics, vehicle customization, and online multiplayer leagues.",
      tags: ["Unreal Engine", "Physics", "Multiplayer"],
      rarity: "RARE",
      rating: "4.7",
      color: "teal",
      image: "linear-gradient(135deg, #0F4C75 0%, #082841 100%)"
    },
    {
      id: 4,
      title: "Cosmic Trader",
      desc: "Space simulation economy game. Trade resources, build stations, and defend trade routes.",
      tags: ["React", "Three.js", "Node.js"],
      rarity: "COMMON",
      rating: "4.5",
      color: "pink",
      image: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%)"
    },
    {
      id: 5,
      title: "Forest Guardian",
      desc: "Relaxing VR experience where you grow and protect a magical procedural forest.",
      tags: ["Unity", "VR", "Oculus SDK"],
      rarity: "EPIC",
      rating: "4.8",
      color: "teal",
      image: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    },
    {
      id: 6,
      title: "Retro Arcade Hub",
      desc: "A collection of 8-bit classic remakes with global leaderboards and tournaments.",
      tags: ["Phaser.js", "Socket.io", "MongoDB"],
      rarity: "RARE",
      rating: "4.6",
      color: "orange",
      image: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)"
    }
  ];

  const visibleProjects = showAll ? allProjects : allProjects.slice(0, 3);

  const generateLore = async () => {
    if (!selectedProject || generatingLore) return;
    setGeneratingLore(true);
    setLore("");
    try {
      const prompt = `Write a short, exciting RPG item description (max 40 words) for a legendary artifact named "${selectedProject.title}". It was forged using ${selectedProject.tags.join(', ')}. Use magical metaphors for the tech.`;
      const result = await model.generateContent(prompt);
      setLore(result.response.text());
    } catch (e) {
      setLore("The ancient runes are unreadable at this time.");
    } finally {
      setGeneratingLore(false);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setLore("");
    setGeneratingLore(false);
  }

  // --- SCROLL LOCK & MODAL HANDLING ---
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <SectionTitle subtitle="Achievements Unlocked" title="Projects" colorClass={COLORS.pink.text} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleProjects.map((p) => (
          <div key={p.id} className="group relative">
             <div className={`absolute inset-0 ${currentTheme.text === 'text-[#E0E0E0]' ? 'bg-white/10' : 'bg-black/10'} rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform`}></div>
             <div className={`relative ${currentTheme.cardBg} border-[3px] border-dashed ${COLORS[p.color].border} rounded-2xl overflow-hidden transition-transform group-hover:-translate-y-1`}>
                
                <div className="h-48 relative overflow-hidden" style={{ background: p.image }}>
                   <div className="absolute top-4 left-4">
                      <Badge color={p.color} filled>{p.rarity}</Badge>
                   </div>
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-bold shadow-sm">
                      <Star size={12} className="text-[#FF9F1C] fill-[#FF9F1C]" /> {p.rating}
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <button 
                        onClick={() => setSelectedProject(p)}
                        className={`bg-white text-[#1A1A1A] px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs border-2 border-[#1A1A1A] hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_#000]`}>
                         View Details
                      </button>
                   </div>
                </div>

                <div className="p-6">
                   <h3 className={`text-xl font-black ${currentTheme.text} mb-2`}>{p.title}</h3>
                   <p className={`text-sm ${currentTheme.textMuted} font-medium mb-4 line-clamp-2`}>{p.desc}</p>
                   <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map(t => <span key={t} className={`text-[10px] font-bold px-2 py-1 ${currentTheme.inputBg} rounded ${currentTheme.textMuted} border ${currentTheme.inputBorder}`}>{t}</span>)}
                   </div>
                   <button 
                     onClick={() => setSelectedProject(p)}
                     className={`w-full py-2 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${COLORS[p.color].border} ${COLORS[p.color].text} border-2 border-dashed hover:bg-opacity-10 hover:${COLORS[p.color].bg} transition-colors`}>
                     View Details <ExternalLink size={14} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
         <button 
          onClick={() => setShowAll(!showAll)}
          className={`${COLORS.pink.bg} text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all`}>
            {showAll ? "Show Less" : "Show More Projects (3 More)"}
         </button>
      </div>

      {/* FIXED MODAL IMPLEMENTATION */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal} // Click outside to close
        >
           {/* Wrapper to handle alignment - items-start for mobile scroll, center for desktop */}
           <div className="flex min-h-full items-start justify-center p-4 md:items-center">
               
               <div 
                 className={`${currentTheme.cardBg} w-full max-w-4xl text-left rounded-2xl shadow-2xl border-4 border-dashed ${COLORS.pink.border} overflow-hidden relative animate-in zoom-in-95 duration-200 my-8`}
                 onClick={(e) => e.stopPropagation()} // Prevent close when clicking content
               >
                  {/* MODAL HEADER with Close Button */}
                  <div className={`flex justify-between items-center p-4 border-b-2 border-dashed ${COLORS.pink.border} ${currentTheme.inputBg}`}>
                     <div className="flex items-center gap-2">
                        <span className={`font-black uppercase tracking-widest text-sm ${COLORS.pink.text}`}>
                           <Gamepad2 className="inline mr-2" size={18}/>
                           Quest Details
                        </span>
                     </div>
                     <button 
                       onClick={closeModal} 
                       className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${currentTheme.text}`}
                     >
                       <X size={24} />
                     </button>
                  </div>

                  <div className="w-full aspect-video bg-black relative group border-b-2 border-dashed border-gray-700/50">
                     <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                        title="Video Player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0"
                     ></iframe>
                  </div>

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
                          <p className={`${currentTheme.textMuted} font-medium leading-relaxed mb-6`}>
                              {selectedProject.desc} Features include a robust physics engine built from scratch, dynamic lighting systems, and netcode supporting up to 64 players.
                          </p>

                          <div className="flex flex-wrap gap-2 mb-8">
                              {selectedProject.tags.map(t => (
                                <Badge key={t} color="gray">{t}</Badge>
                              ))}
                          </div>

                          <div className={`mb-6 p-4 rounded-xl border-2 border-dashed ${COLORS.purple.border} bg-opacity-5 ${COLORS.purple.bg}`}>
                            <div className="flex items-center justify-between mb-2">
                               <h4 className={`text-xs font-black uppercase ${COLORS.purple.text} flex items-center gap-2`}>
                                 <Sparkles size={14} /> Arcane Lore
                               </h4>
                               {!lore && !generatingLore && (
                                 <button onClick={generateLore} className="text-xs font-bold underline hover:text-[#9B5DE5] transition-colors">
                                   ✨ Reveal Lore
                                 </button>
                               )}
                            </div>
                            {generatingLore ? (
                              <div className="animate-pulse text-sm text-gray-400">Consulting the ancient scrolls...</div>
                            ) : lore ? (
                              <p className={`text-sm italic ${currentTheme.text} animate-in fade-in`}>"{lore}"</p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">Unlock the magical history of this artifact...</p>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                              <button className={`flex-1 ${COLORS.pink.bg} text-white py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center justify-center gap-2`}>
                                <Gamepad2 size={20} /> Play Demo
                              </button>
                              <button className={`flex-1 ${currentTheme.cardBg} ${currentTheme.text} py-3 rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-dashed ${currentTheme.text === 'text-[#E0E0E0]' ? 'border-gray-500' : 'border-[#1A1A1A]'} hover:bg-opacity-10 hover:bg-gray-500 transition-all flex items-center justify-center gap-2`}>
                                <Github size={20} /> Source Code
                              </button>
                          </div>
                       </div>

                       <div className={`w-full lg:w-64 flex-shrink-0 ${currentTheme.inputBg} rounded-xl p-4 border-2 border-dashed ${currentTheme.inputBorder}`}>
                          <h4 className={`text-xs font-bold uppercase ${currentTheme.textMuted} mb-3`}>Preview</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                             <div className="h-24 bg-gray-500 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5)), ${selectedProject.image}` }}></div>
                             </div>
                             <div className="h-24 bg-gray-600 rounded-lg overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity">
                                 <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.5)), ${selectedProject.image}`, filter: 'hue-rotate(90deg)' }}></div>
                             </div>
                          </div>
                       </div>
                     </div>
                  </div>

               </div>
           </div>
        </div>
      )}
    </section>
  );
};

const Contact = () => {
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  const generateQuestBrief = async () => {
    if (!message.trim() || isDrafting) return;
    setIsDrafting(true);
    try {
      const prompt = `Rewrite this request into a formal RPG Quest Brief. Include: "Quest Title", "Objective", and "Rewards". Request: "${message}"`;
      const result = await model.generateContent(prompt);
      setMessage(result.response.text());
    } catch (e) {
      // Fail silently
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    // Basic Functional Email implementation using mailto
    const subject = `New Quest from ${name || 'Adventurer'}`;
    const body = `Adventurer Name: ${name}\nContact Email: ${email}\n\nQuest Details:\n${message}`;
    window.location.href = `mailto:koushik22work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto mb-20">
      <div className="text-center mb-16">
        <div className={`inline-block px-6 py-2 rounded-full border-2 border-dashed ${COLORS.orange.border} ${COLORS.orange.text} font-black uppercase tracking-widest text-sm bg-opacity-10 ${COLORS.orange.bg} mb-4 animate-bounce`}>
           ✎ New Quest Available
        </div>
        <h2 className={`text-3xl md:text-5xl font-black uppercase ${currentTheme.text}`}>
           Get In Touch
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <Card color="purple" className="lg:col-span-5 flex flex-col justify-center">
            <div className={`flex items-center gap-2 ${COLORS.purple.text} font-black uppercase tracking-widest text-xs mb-4`}>
               <Zap size={16} /> Side Quest
            </div>
            <h2 className={`text-3xl font-black ${currentTheme.text} mb-4`}>Let's Team Up!</h2>
            <p className={`${currentTheme.textMuted} font-medium mb-8`}>
               Looking for a party member for your next adventure? Whether it's a freelance project, full-time position, or just want to say hi - I'm always ready for new quests!
            </p>

            <div className="space-y-6 mb-8">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-opacity-10 ${COLORS.purple.bg} flex items-center justify-center ${COLORS.purple.text} border border-dashed ${COLORS.purple.border}`}>
                     <Mail size={24} />
                  </div>
                  <div>
                     <p className={`text-xs font-bold ${currentTheme.textMuted} uppercase`}>Email</p>
                     <p className={`font-bold ${currentTheme.text}`}>koushik22work@gmail.com</p>
                  </div>
               </div>
               {/* <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-opacity-10 ${COLORS.teal.bg} flex items-center justify-center ${COLORS.teal.text} border border-dashed ${COLORS.teal.border}`}>
                     <MapPin size={24} />
                  </div>
                  <div>
                     <p className={`text-xs font-bold ${currentTheme.textMuted} uppercase`}>Location</p>
                     <p className={`font-bold ${currentTheme.text}`}>San Francisco, CA</p>
                  </div>
               </div> */}
            </div>

            <div className={`pt-6 border-t-2 border-dashed ${currentTheme.inputBorder}`}>
               <p className={`text-xs font-bold ${currentTheme.textMuted} mb-4`}>Find me on</p>
               <div className="flex gap-3">
                  {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                     <button key={i} className={`p-3 rounded-lg border-2 border-dashed ${currentTheme.inputBorder} hover:${COLORS.purple.border} hover:${COLORS.purple.text} ${currentTheme.textMuted} transition-colors`}>
                        <Icon size={20} />
                     </button>
                  ))}
               </div>
            </div>
         </Card>

         <Card color="teal" className="lg:col-span-7">
            <div className={`flex items-center justify-between ${COLORS.teal.text} font-black uppercase tracking-widest text-xs mb-6`}>
               <div className="flex items-center gap-2">
                 <Send size={16} /> Send Message
               </div>
               <button 
                  type="button"
                  onClick={generateQuestBrief}
                  disabled={isDrafting || !message}
                  className={`flex items-center gap-1 text-[10px] bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors disabled:opacity-50`}
               >
                 <Sparkles size={12} /> {isDrafting ? "Drafting..." : "Scribe Quest"}
               </button>
            </div>
            
            <form className="space-y-4" onSubmit={handleSendEmail}>
               <div>
                  <label className={`block text-xs font-bold ${currentTheme.textMuted} uppercase mb-1`}>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-lg p-3 font-medium focus:outline-none focus:border-[#2EC4B6] ${currentTheme.cardBg} ${currentTheme.text} transition-colors placeholder:text-gray-400`} 
                  />
               </div>
               <div>
                  <label className={`block text-xs font-bold ${currentTheme.textMuted} uppercase mb-1`}>Your Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-lg p-3 font-medium focus:outline-none focus:border-[#2EC4B6] ${currentTheme.cardBg} ${currentTheme.text} transition-colors placeholder:text-gray-400`} 
                  />
               </div>
               <div>
                  <label className={`block text-xs font-bold ${currentTheme.textMuted} uppercase mb-1`}>Your Message</label>
                  <textarea 
                    rows="4" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your quest... (Type a draft and click 'Scribe Quest'!)" 
                    className={`w-full ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-lg p-3 font-medium focus:outline-none focus:border-[#2EC4B6] ${currentTheme.cardBg} ${currentTheme.text} transition-colors placeholder:text-gray-400 resize-none`}
                  ></textarea>
               </div>

               <button type="submit" className={`w-full ${COLORS.teal.bg} text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center justify-center gap-2 mt-4`}>
                  <Send size={20} /> Send Message
               </button>
            </form>

            <div className={`mt-6 flex items-center justify-center gap-2 text-xs font-bold ${COLORS.orange.text}`}>
               <Zap size={14} fill="currentColor" /> Complete this quest to earn <span className={`${COLORS.orange.text} font-black`}>+100 XP</span>
            </div>
         </Card>
      </div>return
    </section>
  );
};

const Footer = () => {
  const { currentTheme } = useTheme();
  return (
    <footer className={`py-8 border-t-2 border-dashed ${currentTheme.inputBorder} text-center`}>
      <div className={`flex items-center justify-center gap-2 mb-2 font-black ${currentTheme.text}`}>
          <div className={`p-1 border-2 border-dashed ${COLORS.orange.border} rounded ${COLORS.orange.text}`}>
            <Gamepad2 size={20} />
          </div>
          Koushik Roy
      </div>
      <p className={`text-xs font-bold ${currentTheme.textMuted}`}>
          Made with <Heart size={10} className={`inline ${COLORS.pink.text} fill-[#F15BB5]`} /> © 2025 All rights reserved • v1.0.0
      </p>
    </footer>
  );
};

// --- Theme Provider Wrapper ---

const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Sync state with localStorage on change (redundant but safe)
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const currentTheme = THEMES[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <div className={`min-h-screen ${currentTheme.bg} font-sans selection:bg-[#FF9F1C] selection:text-white transition-colors duration-300`}>
        {/* Background Grid Pattern */}
        <div 
           className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `linear-gradient(${theme === 'light' ? '#1A1A1A' : '#FFF'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'light' ? '#1A1A1A' : '#FFF'} 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}
        ></div>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// --- Main App ---

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <ThemeProvider>
        <LoadingScreen onComplete={() => setGameStarted(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Navbar />
      <Hero />
      <Stats />
      <Skills />
      <Experience />
      {/* <Projects /> */}
      <Contact />
      <FamiliarChat />
      <Footer />
    </ThemeProvider>
  );
}