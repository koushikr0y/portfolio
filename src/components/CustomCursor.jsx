import { useEffect, useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CustomCursor() {
  const { theme } = useTheme();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const requestRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      if (!visible) setVisible(true);
      targetPos.current = { x: e.clientX, y: e.clientY };

      const target = e.target;
      const isInteractive = target.closest?.(
        "button, a, input, textarea, select, [role='button'], .cursor-pointer"
      );
      setHovered(!!isInteractive);
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

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
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-100 ease-out"
      style={{
        transform: `translate3d(${pos.x - (hovered ? 16 : 8)}px, ${pos.y - (hovered ? 16 : 8)}px, 0) scale(${
          clicked ? 0.75 : hovered ? 1.25 : 1
        })`,
      }}
    >
      <div
        className={`rounded-full border-2 transition-all duration-200 ${
          hovered
            ? "border-[#2EC4B6] bg-[#2EC4B6]/10 shadow-[0_0_12px_rgba(46,196,182,0.3)]"
            : "border-[#FF9F1C] bg-[#FF9F1C]/20"
        }`}
        style={{
          width: hovered ? "32px" : "16px",
          height: hovered ? "32px" : "16px",
        }}
      />
    </div>
  );
}
