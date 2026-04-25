import { useState, useEffect, useRef } from "react";
import { Bot, X, Sparkles, Send } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";
import { model } from "../config/gemini";
import { PORTFOLIO_DATA } from "../data/portfolioData";

// --- Familiar (Chatbot) Component ---
const FamiliarChat = () => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Greetings, traveler! I am the digital familiar of Koushik Roy. Ask me anything about his skills, experience, or quests!",
    },
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
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
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
        `User asked: ${userMsg}`,
      ]);
      const response = result.response.text();
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } catch (error) {
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
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-transform hover:scale-110 border-2 border-dashed ${COLORS.purple.border} ${COLORS.purple.bg} text-white`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-40 w-80 md:w-96 h-[500px] ${currentTheme.cardBg} rounded-2xl border-[3px] border-dashed ${COLORS.purple.border} shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300`}
        >
          {/* Header */}
          <div className={`${COLORS.purple.bg} p-4 flex items-center gap-2 text-white`}>
            <Sparkles size={18} />
            <span className="font-black uppercase tracking-wider text-sm">
              Summoned Familiar
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-opacity-50 bg-black/5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm font-medium ${
                    m.role === "user"
                      ? `${COLORS.purple.bg} text-white rounded-br-none`
                      : `${currentTheme.inputBg} ${currentTheme.text} border border-dashed ${currentTheme.inputBorder} rounded-bl-none`
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`${currentTheme.inputBg} p-3 rounded-xl rounded-bl-none border border-dashed ${currentTheme.inputBorder}`}
                >
                  <span className="animate-pulse text-xs text-gray-400">
                    Consulting the archives...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className={`p-3 border-t-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg}`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
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

export default FamiliarChat;
