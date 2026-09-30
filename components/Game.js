"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import GameStage from "./GameStage";
import HUD from "./HUD";
import QuestionModal from "./QuestionModal";
import { Keyboard, Smartphone } from "lucide-react";
import TouchControls from "./TouchControls";
import StartScreen from "./StartScreen";
import WinScreen from "./WinScreen";
import useSound from "../hooks/useSound";
import questions from "../data/questions";
import {
  GROUND_Y,
  LEVEL_W,
  PLAYER_W,
  PLAYER_H,
  START_X,
  SPEED,
  JUMP_POWER,
  GRAVITY,
  GATE_COUNT,
  GATE_XS,
  GATE_W,
  FINISH_X,
  STARS,
  STAR_SIZE,
} from "../lib/level";

const POINTS_PER_ANSWER = 100;
const POINTS_PER_STAR = 10;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function Game() {
  const { init, play, startMusic, stopMusic, toggleMute, muted } = useSound();

  const [status, setStatusState] = useState("start"); // start | playing | question | won
  const [openGates, setOpenGates] = useState(() => Array(GATE_COUNT).fill(false));
  const [collected, setCollected] = useState([]); // ids of collected stars
  const [activeGate, setActiveGate] = useState(null); // gate index with open question
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // ---------- Refs (fast values used by the game loop) ----------
  const statusRef = useRef("start");
  const openRef = useRef(Array(GATE_COUNT).fill(false));
  const collectedRef = useRef(new Set());
  const keysRef = useRef({ left: false, right: false, jump: false });
  const playerData = useRef({ x: START_X, y: GROUND_Y - PLAYER_H, vx: 0, vy: 0, onGround: true, facing: 1 });
  const playerEl = useRef(null);
  const worldEl = useRef(null);
  const bgEl = useRef(null);
  const viewRef = useRef({ w: 800, dy: 0 }); 
  const setStatus = useCallback((value) => {
    statusRef.current = value;
    setStatusState(value);
  }, []);


  const resetGame = useCallback(() => {
    const p = playerData.current;
    p.x = START_X;
    p.y = GROUND_Y - PLAYER_H;
    p.vx = 0;
    p.vy = 0;
    p.onGround = true;
    p.facing = 1;

    openRef.current = Array(GATE_COUNT).fill(false);
    collectedRef.current = new Set();

    setOpenGates(openRef.current);
    setCollected([]);
    setScore(0);
    setActiveGate(null);
    setStatus("playing");
  }, [setStatus]);

  // ---------- Button actions ----------
  const startGame = () => {
    init(); // unlock audio (needs a click)
    play("click");
    startMusic();
    setAttempts(0);
    resetGame();
  };

  const restartFromButton = () => {
    play("click");
    if (statusRef.current === "start") return;
    startMusic();
    setAttempts(0);
    resetGame();
  };

  const playAgain = () => {
    play("click");
    startMusic();
    setAttempts(0);
    resetGame();
  };

  // Correct answer -> open the gate and continue
  const handleCorrect = useCallback(() => {
    if (statusRef.current !== "question" || activeGate === null) return;
    const updated = [...openRef.current];
    updated[activeGate] = true;
    openRef.current = updated;
    setOpenGates(updated);
    setScore((s) => s + POINTS_PER_ANSWER);
    setActiveGate(null);
    setStatus("playing");
    play("open");
  }, [activeGate, play, setStatus]);

  // Wrong answer -> back to the starting point, all gates locked again
  const handleWrong = useCallback(() => {
    if (statusRef.current !== "question") return;
    setAttempts((a) => a + 1);
    resetGame();
  }, [resetGame]);

  // ---------- Keyboard input ----------
  useEffect(() => {
    const keyMap = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "jump",
      KeyW: "jump",
      Space: "jump",
    };
    const onKeyDown = (e) => {
      const action = keyMap[e.code];
      if (!action) return;
      if (statusRef.current === "playing") e.preventDefault(); // stop page scrolling
      keysRef.current[action] = true;
    };
    const onKeyUp = (e) => {
      const action = keyMap[e.code];
      if (action) keysRef.current[action] = false;
    };
    const onBlur = () => {
      keysRef.current = { left: false, right: false, jump: false };
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    let frameId;
    let lastTime = null;

    // Move the player, check gates, stars and the finish flag
    const update = (dt) => {
      const p = playerData.current;
      const keys = keysRef.current;

      // Left / right
      const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      p.vx = dir * SPEED;
      if (dir !== 0) p.facing = dir;

      
      if (keys.jump && p.onGround) {
        p.vy = -JUMP_POWER;
        p.onGround = false;
        play("jump");
      }

      // Horizontal movement
      let newX = clamp(p.x + p.vx * dt, 0, LEVEL_W - PLAYER_W);

      for (let i = 0; i < GATE_COUNT; i++) {
        if (openRef.current[i]) continue;
        const gateX = GATE_XS[i];
        if (newX + PLAYER_W > gateX && newX < gateX + GATE_W) {
          newX = gateX - PLAYER_W;
          p.vx = 0;
          keysRef.current.left = false;
          keysRef.current.right = false;
          setActiveGate(i);
          setStatus("question");
          play("knock");
          break;
        }
      }
      p.x = newX;

      // Gravity and ground
      p.vy += GRAVITY * dt;
      p.y += p.vy * dt;
      if (p.y >= GROUND_Y - PLAYER_H) {
        p.y = GROUND_Y - PLAYER_H;
        p.vy = 0;
        p.onGround = true;
      } else {
        p.onGround = false;
      }

      // Collect stars
      for (const s of STARS) {
        if (collectedRef.current.has(s.id)) continue;
        const touching =
          p.x < s.x + STAR_SIZE && p.x + PLAYER_W > s.x && p.y < s.y + STAR_SIZE && p.y + PLAYER_H > s.y;
        if (touching) {
          collectedRef.current.add(s.id);
          setCollected((list) => [...list, s.id]);
          setScore((v) => v + POINTS_PER_STAR);
          play("star");
        }
      }

      // Reached the flag?
      if (p.x + PLAYER_W >= FINISH_X && statusRef.current === "playing") {
        setStatus("won");
        stopMusic();
        play("win");
      }
    };

    // Move the elements on screen
    const draw = () => {
      const p = playerData.current;
            const { w: viewW, dy } = viewRef.current;
      const camX = clamp(p.x + PLAYER_W / 2 - viewW / 2, 0, LEVEL_W - viewW);

      if (worldEl.current) worldEl.current.style.transform = `translate3d(${-camX}px,${dy}px,0)`;
      if (bgEl.current) bgEl.current.style.transform = `translate3d(${-camX * 0.3}px,0,0)`;
      if (playerEl.current) {
        const el = playerEl.current;
        el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
        el.dataset.facing = p.facing > 0 ? "right" : "left";
        el.dataset.moving = p.vx !== 0 && p.onGround ? "yes" : "no";
      }
    };

    const tick = (time) => {
      const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;
      if (statusRef.current === "playing") update(dt);
      draw();
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [play, stopMusic, setStatus]);

  // ---------- What appears on screen ----------
  return (
    <div className="game-shell">
      <div className="game-col">
        <HUD
          status={status}
          openGates={openGates}
          score={score}
          stars={collected.length}
          attempts={attempts}
          muted={muted}
          onToggleMute={toggleMute}
          onRestart={restartFromButton}
        />

        <GameStage
          openGates={openGates}
          collected={collected}
          activeGate={activeGate}
          worldRef={worldEl}
          bgRef={bgEl}
                    playerRef={playerEl}
          viewRef={viewRef}
        />

        <TouchControls keysRef={keysRef} />

                <p className="hint key-hint"><Keyboard size={18} /> Arrow keys / A D to move · Space to jump</p>
        <p className="hint rotate-hint"><Smartphone size={18} /> Tip: turn your phone sideways for a bigger view.</p>
      </div>

      {status === "start" && <StartScreen onStart={startGame} />}

      {status === "question" && activeGate !== null && (
        <QuestionModal
          key={activeGate}
          gateNumber={activeGate + 1}
          totalGates={GATE_COUNT}
          data={questions[activeGate]}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          play={play}
        />
      )}

      {status === "won" && (
        <WinScreen score={score} stars={collected.length} attempts={attempts} onPlayAgain={playAgain} />
      )}
    </div>
  );
}
