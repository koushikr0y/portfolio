import { useEffect, useRef } from "react";

const COLORS = ["#FF9F1C", "#2EC4B6", "#9B5DE5", "#F15BB5", "#ffffff"];

function spawnBurst(x, y) {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "burst-particle";
    const angle = (i / count) * 360;
    const dist = 28 + Math.random() * 28;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    const size = 4 + Math.floor(Math.random() * 4);
    el.style.cssText = `
      left:${x - size / 2}px; top:${y - size / 2}px;
      width:${size}px; height:${size}px;
      background:${COLORS[i % COLORS.length]};
      --tx:${tx}px; --ty:${ty}px;
      animation-duration:${0.45 + Math.random() * 0.2}s;
      animation-delay:${i * 0.015}s;
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }
}

const ParticleBurst = () => {
  useEffect(() => {
    const handler = (e) => {
      // Only fire on buttons, links and interactive elements
      const target = e.target.closest("button, a, [data-burst]");
      if (target) spawnBurst(e.clientX, e.clientY);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
};

export default ParticleBurst;
