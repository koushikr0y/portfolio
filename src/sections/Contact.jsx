import { useState } from "react";
import { Mail, Send, Zap, Github, Linkedin, Twitter, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { Card } from "../components/UI";
import { model } from "../config/gemini";
// import { socialLinks } from "../data/portfolioData";
// import { Github, Linkedin, Twitter, Mail } from "lucide-react";

// --- Contact Section ---
const Contact = () => {
  const { currentTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // --- Gemini: Rewrite the message as an RPG Quest Brief ---
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

  // --- Basic mailto implementation ---
  const handleSendEmail = (e) => {
    e.preventDefault();
    const subject = `New Quest from ${name || "Adventurer"}`;
    const body = `Adventurer Name: ${name}\nContact Email: ${email}\n\nQuest Details:\n${message}`;
    window.location.href = `mailto:koushik22work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto mb-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div
          className={`inline-block px-6 py-2 rounded-full border-2 border-dashed ${COLORS.orange.border} ${COLORS.orange.text} font-black uppercase tracking-widest text-sm bg-opacity-10 ${COLORS.orange.bg} mb-4 animate-bounce`}
        >
          ✎ New Quest Available
        </div>
        <h2 className={`text-3xl md:text-5xl font-black uppercase ${currentTheme.text}`}>
          Get In Touch
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Contact Info */}
        <Card color="purple" className="lg:col-span-5 flex flex-col justify-center">
          <div className={`flex items-center gap-2 ${COLORS.purple.text} font-black uppercase tracking-widest text-xs mb-4`}>
            <Zap size={16} /> Side Quest
          </div>
          <h2 className={`text-3xl font-black ${currentTheme.text} mb-4`}>Let's Team Up!</h2>
          <p className={`${currentTheme.textMuted} font-medium mb-8`}>
            Looking for a party member for your next adventure? Whether it's a freelance project,
            full-time position, or just want to say hi - I'm always ready for new quests!
          </p>

          <div className="space-y-6 mb-8">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-opacity-10 ${COLORS.purple.bg} flex items-center justify-center ${COLORS.purple.text} border border-dashed ${COLORS.purple.border}`}
              >
                <Mail size={24} />
              </div>
              <div>
                <p className={`text-xs font-bold ${currentTheme.textMuted} uppercase`}>Email</p>
                <p className={`font-bold ${currentTheme.text}`}>koushik22work@gmail.com</p>
              </div>
            </div>

            {/* Location (commented out) */}
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

          {/* Social Links */}

          {/* <div className={`pt-6 border-t-2 border-dashed ${currentTheme.inputBorder}`}>
            <p className={`text-xs font-bold ${currentTheme.textMuted} mb-4`}>Find me on</p>
            <div className="flex gap-3">
              {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className={`p-3 rounded-lg border-2 border-dashed ${currentTheme.inputBorder} hover:${COLORS.purple.border} hover:${COLORS.purple.text} ${currentTheme.textMuted} transition-colors`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div> */}
        </Card>

        {/* Right: Contact Form */}
        <Card color="teal" className="lg:col-span-7">
          {/* Form Header */}
          <div
            className={`flex items-center justify-between ${COLORS.teal.text} font-black uppercase tracking-widest text-xs mb-6`}
          >
            <div className="flex items-center gap-2">
              <Send size={16} /> Send Message
            </div>
            {/* Gemini Quest Brief Button */}
            <button
              type="button"
              onClick={generateQuestBrief}
              disabled={isDrafting || !message}
              className="flex items-center gap-1 text-[10px] bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors disabled:opacity-50"
            >
              <Sparkles size={12} /> {isDrafting ? "Drafting..." : "Scribe Quest"}
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSendEmail}>
            <div>
              <label className={`block text-xs font-bold ${currentTheme.textMuted} uppercase mb-1`}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-lg p-3 font-medium focus:outline-none focus:border-[#2EC4B6] ${currentTheme.cardBg} ${currentTheme.text} transition-colors placeholder:text-gray-400`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold ${currentTheme.textMuted} uppercase mb-1`}>
                Your Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-lg p-3 font-medium focus:outline-none focus:border-[#2EC4B6] ${currentTheme.cardBg} ${currentTheme.text} transition-colors placeholder:text-gray-400`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold ${currentTheme.textMuted} uppercase mb-1`}>
                Your Message
              </label>
              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your quest... (Type a draft and click 'Scribe Quest'!)"
                className={`w-full ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-lg p-3 font-medium focus:outline-none focus:border-[#2EC4B6] ${currentTheme.cardBg} ${currentTheme.text} transition-colors placeholder:text-gray-400 resize-none`}
              ></textarea>
            </div>

            <button
              type="submit"
              className={`w-full ${COLORS.teal.bg} text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all flex items-center justify-center gap-2 mt-4`}
            >
              <Send size={20} /> Send Message
            </button>
          </form>

          {/* XP Reward Hint */}
          <div className={`mt-6 flex items-center justify-center gap-2 text-xs font-bold ${COLORS.orange.text}`}>
            <Zap size={14} fill="currentColor" /> Complete this quest to earn{" "}
            <span className={`${COLORS.orange.text} font-black`}>+100 XP</span>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
