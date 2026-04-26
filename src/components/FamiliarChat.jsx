import { useState, useEffect, useRef } from "react";
import { Bot, X, Sparkles, Send, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { model } from "../config/gemini";
import { PORTFOLIO_DATA } from "../data/portfolioData";

const FamiliarChat = () => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Greetings, traveler! I am the digital familiar of Koushik Roy. Ask me anything about his skills, experience, or quests!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [btnWiggle, setBtnWiggle] = useState(false);
  const messagesEndRef = useRef(null);

  // Wiggle the button after 3s to draw attention
  useEffect(() => {
    const t = setTimeout(() => setBtnWiggle(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Mount/unmount with animation
  const openChat = () => {
    setIsOpen(true);
    setHasUnread(false);
    setTimeout(() => setIsVisible(true), 10);
  };

  const closeChat = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 280);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);
    try {
      const systemPrompt = `
        You are a mystical Digital Familiar for Koushik Roy, a Level 24 Game Developer.
        Your tone is a mix of high-fantasy RPG and technical jargon (e.g., "I shall query the archives", "His mana pool of C++ is vast").
        Be helpful, concise, and enthusiastic.
        Here is Koushik's data: ${JSON.stringify(PORTFOLIO_DATA)}
        Answer the user's question based on this data. If you don't know, say you need to consult the ancient scrolls.
      `;
      const result = await model.generateContent([systemPrompt, `User asked: ${userMsg}`]);
      const response = result.response.text();
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "My connection to the ether is weak... (API Error)" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={isOpen ? closeChat : openChat}
        title="Chat with Familiar"
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full border-2 border-dashed
          ${COLORS.purple.border} ${COLORS.purple.bg} text-white
          shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
          hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.35)]
          hover:-translate-y-1 hover:scale-110
          active:translate-y-0 active:scale-95
          transition-all duration-200`}
        style={{
          animation: btnWiggle && !isOpen ? "wiggle 0.5s ease-in-out 2" : "none",
        }}
        onAnimationEnd={() => setBtnWiggle(false)}
      >
        {isOpen
          ? <X size={24} className="transition-transform duration-200" />
          : (
            <div className="relative">
              <Bot size={24} />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#F15BB5] border-2 border-white"
                  style={{ animation: "ping 1s ease-out infinite" }} />
              )}
            </div>
          )
        }

        {/* Ripple ring */}
        <span
          className={`absolute inset-0 rounded-full border-2 ${COLORS.purple.border} pointer-events-none opacity-0`}
          style={{ animation: !isOpen ? "ping 2s ease-out infinite" : "none", opacity: 0.4 }}
        />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-40 w-80 md:w-96 h-[500px]
            ${currentTheme.cardBg} rounded-2xl border-[3px] border-dashed ${COLORS.purple.border}
            shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)]
            flex flex-col overflow-hidden`}
          style={{
            transform: isVisible ? "scale(1) translateY(0)" : "scale(0.85) translateY(20px)",
            opacity: isVisible ? 1 : 0,
            transformOrigin: "bottom right",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
          }}
        >
          {/* Header */}
          <div className={`${COLORS.purple.bg} p-4 flex items-center justify-between text-white`}>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="animate-flicker" />
              <span className="font-black uppercase tracking-wider text-sm">Summoned Familiar</span>
            </div>
            <button
              onClick={closeChat}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors duration-150"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                style={{
                  animation: "slide-up 0.25s ease both",
                  animationDelay: "0ms",
                }}
              >
                {m.role === "assistant" && (
                  <div className={`w-7 h-7 rounded-full ${COLORS.purple.bg} flex items-center justify-center mr-2 flex-shrink-0 mt-1`}>
                    <Sparkles size={12} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium leading-relaxed
                    ${m.role === "user"
                      ? `${COLORS.purple.bg} text-white rounded-br-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]`
                      : `${currentTheme.inputBg} ${currentTheme.text} border border-dashed ${currentTheme.inputBorder} rounded-bl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]`
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start" style={{ animation: "slide-up 0.2s ease both" }}>
                <div className={`w-7 h-7 rounded-full ${COLORS.purple.bg} flex items-center justify-center mr-2 flex-shrink-0 mt-1`}>
                  <Sparkles size={12} className="text-white animate-spin" />
                </div>
                <div className={`${currentTheme.inputBg} p-3 rounded-2xl rounded-bl-none border border-dashed ${currentTheme.inputBorder} flex gap-1 items-center`}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${COLORS.purple.bg} opacity-70`}
                      style={{ animation: `blink 1s step-end infinite`, animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div className={`p-3 border-t-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg} flex gap-2`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about skills, projects..."
              className={`flex-1 ${currentTheme.inputBg} border-2 border-dashed ${currentTheme.inputBorder} rounded-xl px-3 py-2
                text-sm ${currentTheme.text} font-medium
                focus:border-[#9B5DE5] transition-colors duration-200`}
              style={{ outline: "none" }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`${COLORS.purple.bg} text-white p-2.5 rounded-xl
                border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
                hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:scale-105
                active:translate-y-0 active:shadow-none active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0
                transition-all duration-150`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FamiliarChat;
