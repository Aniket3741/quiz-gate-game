"use client";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

function HoldButton({ name, label, keysRef, className = "" }) {
  const press = (e) => {
    e.preventDefault();
    keysRef.current[name] = true;
  };
  const release = (e) => {
    e.preventDefault();
    keysRef.current[name] = false;
  };

  return (
    <button
      className={`touch-btn ${className}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={name}
    >
      {label}
    </button>
  );
}

// On-screen buttons for phones and tablets
export default function TouchControls({ keysRef }) {
  return (
    <div className="touch-controls">
      <div className="touch-group">
               <HoldButton name="left" label={<ChevronLeft size={38} />} keysRef={keysRef} />
        <HoldButton name="right" label={<ChevronRight size={38} />} keysRef={keysRef} />
      </div>
            <HoldButton name="jump" label={<ChevronUp size={38} />} keysRef={keysRef} className="jump" />
    </div>
  );
}
