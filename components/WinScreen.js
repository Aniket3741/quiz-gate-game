import Confetti from "./Confetti";
import { GATE_COUNT, STARS } from "../lib/level";
import { Trophy } from "lucide-react";
export default function WinScreen({ score, stars, attempts, onPlayAgain }) {
  return (
    <div className="overlay">
      <Confetti />

      <div className="panel center">
                <div className="big-emoji"><Trophy size={56} color="#f5a623" /></div>
        <h1 className="title">Level complete!</h1>
        <p className="subtitle">You unlocked all {GATE_COUNT} gates.</p>

        <div className="results">
          <div>
            <strong>{score}</strong>
            <span>Score</span>
          </div>
          <div>
            <strong>
              {stars}/{STARS.length}
            </strong>
            <span>Stars</span>
          </div>
          <div>
            <strong>{attempts + 1}</strong>
            <span>{attempts === 0 ? "Try" : "Tries"}</span>
          </div>
        </div>

        <button className="primary-btn" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}