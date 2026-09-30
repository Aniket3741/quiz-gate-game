"use client";
import { useEffect, useState } from "react";

const COLORS = ["#ff4f9a", "#ffd93d", "#2ecc71", "#2575fc", "#a55eea", "#ff9f43", "#00d2d3"];

export default function Confetti({ count = 90, burstCount = 48, duration = 5000 }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  // Fade out during the last second, then remove the confetti
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), duration - 1000);
    const stopTimer = setTimeout(() => setVisible(false), duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(stopTimer);
    };
  }, [duration]);

  if (!visible) return null;
  // Pieces that shoot out from the middle of the screen
  const burst = Array.from({ length: burstCount }, (_, i) => {
    const angle = (i / burstCount) * Math.PI * 2;
    const distance = 140 + ((i * 53) % 180);
    return (
      <span
        key={`b${i}`}
        className="confetti-piece burst"
        style={{
          background: COLORS[i % COLORS.length],
          borderRadius: i % 3 === 0 ? "50%" : "2px",
          "--bx": `${Math.cos(angle) * distance}px`,
          "--by": `${Math.sin(angle) * distance - 80}px`,
          animationDelay: `${(i % 6) * 0.03}s`,
        }}
      />
    );
  });

  // Pieces that fall from the top like rain
  const rain = Array.from({ length: count }, (_, i) => {
    const r = ((i * 37) % 100) / 100;
    return (
      <span
        key={`r${i}`}
        className="confetti-piece rain"
        style={{
          left: `${(i * 29) % 100}%`,
          width: 6 + r * 8,
          height: 8 + r * 12,
          background: COLORS[i % COLORS.length],
          borderRadius: i % 4 === 0 ? "50%" : "2px",
          "--drift": `${(r - 0.5) * 240}px`,
          "--spin": `${360 + r * 720}deg`,
          animationDelay: `${0.5 + (i % 12) * 0.22}s`,
          animationDuration: `${2.6 + r * 2}s`,
        }}
      />
    );
  });

  return (
      <div
      className="confetti-layer"
      aria-hidden="true"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 1s" }}
    >
      {burst}
      {rain}
    </div>
  );
}