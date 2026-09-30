"use client";
import { useEffect, useState } from "react";
import { BookOpen, Check, X } from "lucide-react";
const LETTERS = ["A", "B", "C", "D"];


export default function QuestionModal({ gateNumber, totalGates, data, onCorrect, onWrong, play }) {
  const [selected, setSelected] = useState(null); // which option was clicked
  const [result, setResult] = useState(null); // null | "correct" | "wrong"

  const choose = (index) => {
    if (result) return; 
    const isCorrect = index === data.correctIndex;
    setSelected(index);
    setResult(isCorrect ? "correct" : "wrong");
    play(isCorrect ? "correct" : "wrong");
  };

  
  useEffect(() => {
    if (result !== "correct") return;
    const timer = setTimeout(onCorrect, 2200);
    return () => clearTimeout(timer);
  }, [result, onCorrect]);

  const optionClass = (i) => {
    let cls = "option";
    if (selected === i) cls += ` ${result}`;
    if (result === "wrong" && i === data.correctIndex) cls += " reveal";
    return cls;
  };

  return (
    <div className="overlay">
      <div className={`panel ${result === "wrong" ? "shake" : ""}`} role="dialog" aria-modal="true">
        <div className="panel-head">
          <span className="gate-tag">
            Gate {gateNumber} of {totalGates}
          </span>
        </div>

                <p className="context">
          <BookOpen size={22} color="#e6a800" style={{ flex: "none" }} />
          <span>{data.context}</span>
        </p>
        <h2 className="question">{data.question}</h2>

        <div className="options">
          {data.options.map((text, i) => (
            <button key={i} className={optionClass(i)} onClick={() => choose(i)} disabled={result !== null}>
              <span className="letter">{LETTERS[i]}</span>
              <span>{text}</span>
            </button>
          ))}
        </div>

        {result && (
          <div className={`feedback ${result}`} aria-live="polite">
                       <strong>
              {result === "correct" ? (
                <>
                  <Check size={20} color="#2ecc71" /> Correct! +100 points
                </>
              ) : (
                <>
                  <X size={20} color="#ff4757" /> Not quite. Back to the start!
                </>
              )}
            </strong>
            <p>{data.explanation}</p>
            <button className="primary-btn small" onClick={result === "correct" ? onCorrect : onWrong}>
              {result === "correct" ? "Open the gate" : "Restart from the beginning"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
