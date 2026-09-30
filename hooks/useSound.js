"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Sounds are generated with the browser's Web Audio API,
// so you do NOT need any audio files. (See README to use MP3 files instead.)

const MELODY = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
const BASS = [131, 175, 131, 196];

export default function useSound() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const musicTimer = useRef(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  // Must be called from a click/tap (browsers block audio before that)
  const init = useCallback(() => {
    if (ctxRef.current) {
      if (ctxRef.current.state === "suspended") ctxRef.current.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = mutedRef.current ? 0 : 1;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;
  }, []);

  // Plays one note
  const tone = useCallback((freq, delay, duration, type = "sine", volume = 0.15, slideTo) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(masterRef.current);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }, []);


    // Plays a short burst of noise (used for confetti pops and applause)
  const noise = useCallback((delay, duration, volume = 0.2, freq = 1500) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const size = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterRef.current);
    source.start(t);
  }, []);

  // Sound effects: click, jump, star, knock, correct, wrong, open, win
  const play = useCallback(
    (name) => {
      switch (name) {
        case "click":
          tone(600, 0, 0.08, "square", 0.06);
          break;
        case "jump":
          tone(300, 0, 0.18, "square", 0.06, 700);
          break;
        case "star":
          tone(988, 0, 0.08, "triangle", 0.14);
          tone(1319, 0.08, 0.16, "triangle", 0.14);
          break;
        case "knock":
          tone(220, 0, 0.2, "sawtooth", 0.12, 120);
          tone(220, 0.22, 0.2, "sawtooth", 0.12, 120);
          break;
        case "correct":
          [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.25, "triangle", 0.16));
          break;
        case "wrong":
          tone(300, 0, 0.3, "sawtooth", 0.14, 100);
          tone(200, 0.25, 0.45, "sawtooth", 0.14, 70);
          break;
        case "open":
          tone(150, 0, 0.7, "sawtooth", 0.07, 500);
          break;
             case "win":
          // 1. Confetti pops
          [0, 0.07, 0.15, 0.24, 0.35].forEach((d, i) => noise(d, 0.12, 0.35, 1400 + i * 400));
          // 2. Fanfare melody
          [523, 523, 659, 784, 659, 784, 1047, 1319].forEach((f, i) =>
            tone(f, 0.1 + i * 0.14, 0.3, "triangle", 0.16)
          );
          // 3. Big final chord
          [523, 659, 784, 1047].forEach((f) => tone(f, 1.3, 1.4, "triangle", 0.1));
          // 4. Sparkles
          for (let i = 0; i < 10; i++) {
            tone(1500 + ((i * 173) % 1500), 1.4 + i * 0.12, 0.15, "sine", 0.07);
          }
          // 5. Applause
          noise(1.3, 2.4, 0.07, 3000);
          break;
        default:
          break;
      }
    },
       [tone, noise]
  );

  const startMusic = useCallback(() => {
    if (!ctxRef.current) return;
    clearInterval(musicTimer.current);
    let step = 0;
    musicTimer.current = setInterval(() => {
      tone(MELODY[step % MELODY.length], 0, 0.22, "triangle", 0.05);
      if (step % 4 === 0) {
        tone(BASS[Math.floor(step / 4) % BASS.length], 0, 0.9, "sine", 0.07);
      }
      step++;
    }, 240);
  }, [tone]);

  const stopMusic = useCallback(() => {
    clearInterval(musicTimer.current);
  }, []);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    if (masterRef.current) masterRef.current.gain.value = mutedRef.current ? 0 : 1;
    setMuted(mutedRef.current);
  }, []);

  // Clean up when leaving the page
  useEffect(() => {
    return () => {
      clearInterval(musicTimer.current);
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  return { init, play, startMusic, stopMusic, toggleMute, muted };
}
