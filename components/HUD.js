import { GATE_COUNT } from "../lib/level";
import { Star, Trophy, Repeat, Volume2, VolumeX, RotateCcw } from "lucide-react";
const STATUS_TEXT = {
  start: "Ready?",
  playing: "Run to the next gate!",
  question: "Answer to open the gate!",
  won: "You did it!",
};

// Top bar: progress, score, stars, attempts, sound and restart buttons
export default function HUD({ status, openGates, score, stars, attempts, muted, onToggleMute, onRestart }) {
  const opened = openGates.filter(Boolean).length;

  return (
    <header className="hud">
      <div className="hud-left">
        <span className="hud-title">Quiz Quest</span>
        <div className="hud-progress" aria-label={`Gates opened: ${opened} of ${GATE_COUNT}`}>
          {Array.from({ length: GATE_COUNT }, (_, i) => (
            <span key={i} className={`dot ${openGates[i] ? "done" : ""}`} />
          ))}
          <span className="hud-count">
            {opened}/{GATE_COUNT}
          </span>
        </div>
      </div>

      <div className="hud-right">
        <span className={`chip status ${status}`}>{STATUS_TEXT[status]}</span>
                <span className="chip"><Star size={16} fill="currentColor" /> {stars}</span>
        <span className="chip"><Trophy size={16} /> {score}</span>
        <span className="chip"><Repeat size={16} /> {attempts}</span>
        <button className="icon-btn" onClick={onToggleMute} aria-label={muted ? "Unmute" : "Mute"}>
                    {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button className="icon-btn" onClick={onRestart} aria-label="Restart game">
                    <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}
