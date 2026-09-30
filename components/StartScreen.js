import { TOPIC_NAME } from "../data/questions";
import { GATE_COUNT } from "../lib/level";
import { Footprints, Lock, Check, X, Star } from "lucide-react";

export default function StartScreen({ onStart }) {
  return (
    <div className="overlay">
      <div className="panel center">
        <div className="big-emoji">🚀</div>
        <h1 className="title">Quiz Quest</h1>
        <p className="subtitle">Topic: {TOPIC_NAME}</p>

               <ul className="rules">
          <li><Footprints size={20} color="#2575fc" /> Run and jump to reach the gates.</li>
          <li><Lock size={20} color="#ee5a24" /> Touch a gate to get a question. You need to answer all {GATE_COUNT}.</li>
          <li><Check size={20} color="#2ecc71" /> Correct answer: the gate opens.</li>
          <li><X size={20} color="#ff4757" /> Wrong answer: you go back to the start.</li>
          <li><Star size={20} color="#f5a623" fill="#ffd93d" /> Collect stars for bonus points.</li>
        </ul>

        <p className="controls-text">
          Keyboard: Arrow keys or A / D to move, Space to jump.
          <br />
          Touch: use the buttons under the game.
        </p>

        <button className="primary-btn" onClick={onStart}>
          Start game
        </button>
      </div>
    </div>
  );
}
