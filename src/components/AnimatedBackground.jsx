import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, // %
  size: Math.random() * 6 + 3, // px
  duration: Math.random() * 12 + 10, // s
  delay: Math.random() * 8, // s
  color: ["#FF9F1C", "#2EC4B6", "#9B5DE5", "#F15BB5"][i % 4],
}));

export const AnimatedBackground = () => {
  const { theme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Mouse Tracking Radial Spotlight */}
      <div
        className="absolute transition-transform duration-300 ease-out rounded-full opacity-40 blur-[120px]"
        style={{
          width: "600px",
          height: "600px",
          top: `${mousePos.y - 300}px`,
          left: `${mousePos.x - 300}px`,
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(46,196,182,0.2) 0%, rgba(155,93,229,0.12) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,159,28,0.18) 0%, rgba(46,196,182,0.1) 50%, transparent 70%)",
        }}
      />

      {/* Floating Retro Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(${theme === "dark" ? "#2EC4B6" : "#0F172A"} 1px, transparent 1px),
            linear-gradient(90deg, ${theme === "dark" ? "#2EC4B6" : "#0F172A"} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "bgGridScroll 20s linear infinite",
        }}
      />

      {/* Retro Scanning Cyber Laser Beam */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2EC4B6]/30 to-transparent animate-laser-scan opacity-60" />

      {/* Floating Arcade Particles / Pixel Dust */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            opacity: theme === "dark" ? 0.6 : 0.4,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            bottom: "-20px",
          }}
        />
      ))}

      {/* CSS Keyframe Styles */}
      <style>{`
        @keyframes bgGridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-105vh) scale(1.4) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes laser-scan {
          0% { top: -5%; opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% { top: 105%; opacity: 0; }
        }

        .animate-laser-scan {
          animation: laser-scan 10s ease-in-out infinite;
        }

        .animate-float-particle {
          animation-name: float-particle;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};
