import { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CustomCursor() {
  const { theme } = useTheme();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if device supports fine mouse pointer
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      // Detect hover on interactive elements
      const target = e.target;
      const isInteractive = target.closest(
        "button, a, input, textarea, select, [role='button'], .cursor-pointer"
      );
      setHovered(!!isInteractive);
    };

    const handleMouseDown = (e) => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);

      // Spawn click particles
      const newParticles = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const speed = 25 + Math.random() * 20;
        return {
          id: Date.now() + i,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: ["#2EC4B6", "#FF9F1C", "#F15BB5", "#9B5DE5"][i % 4],
          size: Math.random() > 0.5 ? 6 : 4,
        };
      });

      setParticles((prev) => [...prev, ...newParticles]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    // Smooth lerp cursor motion loop
    let currentX = -100;
    let currentY = -100;
    const animate = () => {
      currentX += (targetPos.current.x - currentX) * 0.35;
      currentY += (targetPos.current.y - currentY) * 0.35;
      setPos({ x: currentX, y: currentY });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Clean up particles over time
  useEffect(() => {
    if (particles.length === 0) return;
    const timeout = setTimeout(() => {
      setParticles((prev) => prev.slice(6));
    }, 450);
    return () => clearTimeout(timeout);
  }, [particles]);

  // Don't render on touch screen mobile devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Reticle Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${pos.x - (hovered ? 20 : 12)}px, ${pos.y - (hovered ? 20 : 12)}px, 0) scale(${
            clicked ? 0.75 : hovered ? 1.35 : 1
          })`,
        }}
      >
        <div
          className={`rounded-full border-2 border-dashed ${
            hovered ? "border-[#2EC4B6] bg-[#2EC4B6]/15" : "border-[#FF9F1C]/70"
          }`}
          style={{
            width: hovered ? "40px" : "24px",
            height: hovered ? "40px" : "24px",
            boxShadow: hovered ? "0 0 15px rgba(46,196,182,0.4)" : "none",
          }}
        />
      </div>

      {/* Center Pixel Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-sm ${
            hovered ? "bg-[#F15BB5]" : "bg-[#FF9F1C]"
          }`}
        />
      </div>

      {/* Click Particle Burst Layer */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-sm animate-ping"
          style={{
            transform: `translate3d(${p.x + p.vx}px, ${p.y + p.vy}px, 0)`,
            width: p.size,
            height: p.size,
            background: p.color,
            transition: "all 0.4s ease-out",
            opacity: 0.8,
          }}
        />
      ))}
    </>
  );
}
