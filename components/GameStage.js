"use client";
import { useEffect, useRef, useState } from "react";
import { Cloud, Lock, LockOpen, Star, Flag } from "lucide-react";
import {
  VIEW_H,
  GROUND_Y,
  GATE_XS,
  GATE_W,
  FINISH_X,
  LEVEL_W,
  STARS,
  STAR_SIZE,
  BG_W,
  CLOUDS,
} from "../lib/level";

const MIN_VIEW_W = 440; // the camera always shows at least this much width
const MAX_SCALE = 1.8; // stops the game from zooming too much on huge screens

// Draws the level and fills ALL the space given to it.
// Game.js moves the player/camera through the refs (fast, no re-render).
export default function GameStage({ openGates, collected, activeGate, worldRef, bgRef, playerRef, viewRef }) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ scale: 1, w: 800, h: VIEW_H });

  // Fit the game to the available width AND height
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return;
      const scale = Math.min(H / VIEW_H, W / MIN_VIEW_W, MAX_SCALE);
      const w = W / scale; // visible game width
      const h = H / scale; // visible game height
      viewRef.current = { w, dy: h - VIEW_H }; // dy keeps the ground at the bottom
      setSize({ scale, w, h });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewRef]);

  return (
    <div className="stage-wrap" ref={wrapRef}>
      <div
        className="stage"
        style={{
          width: size.w,
          height: size.h,
          transform: `scale(${size.scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Slow background layer */}
        <div className="bg-layer" ref={bgRef} style={{ width: BG_W }}>
          {CLOUDS.map((c) => (
            <span key={c.id} className="cloud" style={{ left: c.left, top: c.top }}>
              <Cloud size={c.size * 1.6} color="#ffffff" fill="#ffffff" />
            </span>
          ))}
          <div className="hills" />
        </div>

        {/* The moving world */}
        <div className="world" ref={worldRef} style={{ width: LEVEL_W }}>
          <div className="ground" style={{ top: GROUND_Y, height: VIEW_H - GROUND_Y + 60 }} />

          {GATE_XS.map((x, i) => (
            <div
              key={i}
              className={`gate ${openGates[i] ? "open" : ""} ${activeGate === i ? "active" : ""}`}
              style={{ left: x, width: GATE_W, top: -1500, height: GROUND_Y + 1500 }}
            >
              <span className="gate-lock">
                {openGates[i] ? <LockOpen size={26} color="#fff" /> : <Lock size={26} color="#fff" />}
              </span>
              <span className="gate-badge">{i + 1}</span>
            </div>
          ))}

          {STARS.filter((s) => !collected.includes(s.id)).map((s) => (
            <span key={s.id} className="star" style={{ left: s.x, top: s.y, width: STAR_SIZE, height: STAR_SIZE }}>
              <Star size={26} color="#e6a800" fill="#ffd93d" />
            </span>
          ))}

          <div className="finish" style={{ left: FINISH_X, top: GROUND_Y - 76 }}>
            <Flag size={60} color="#c0392b" fill="#ff4757" />
          </div>

          <div className="player" ref={playerRef} data-facing="right" data-moving="no">
            <div className="player-body">
              <div className="player-skin">
                <div className="eyes">
                  <span />
                  <span />
                </div>
                <div className="mouth" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}