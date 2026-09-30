// Everything about the size and layout of the level lives here.
// Gates are created automatically from the number of questions.
import questions from "../data/questions";

// Size of the game "camera" (the visible part of the level)
export const VIEW_W = 800;
export const VIEW_H = 450;

// Where the ground starts (y position of the grass top)
export const GROUND_Y = 370;

// Player
export const PLAYER_W = 40;
export const PLAYER_H = 56;
export const START_X = 60;

// Movement (pixels per second)
export const SPEED = 270;
export const JUMP_POWER = 640;
export const GRAVITY = 1800;

// Gates
export const GATE_COUNT = questions.length;
export const GATE_W = 28;
export const GATE_XS = questions.map((_, i) => 700 + i * 550);

// Finish flag and total length of the level
export const FINISH_X = GATE_XS[GATE_COUNT - 1] + 400;
export const LEVEL_W = FINISH_X + 300;

// Stars (bonus points): 3 stars before every gate + 3 after the last gate
export const STAR_SIZE = 28;
export const STARS = [];
for (let seg = 0; seg <= GATE_COUNT; seg++) {
  const start = seg === 0 ? 250 : GATE_XS[seg - 1] + 120;
  const end = seg < GATE_COUNT ? GATE_XS[seg] - 120 : FINISH_X - 60;
  const heights = [300, 240, 300];
  [0.15, 0.5, 0.85].forEach((t, j) => {
    STARS.push({
      id: `star-${seg}-${j}`,
      x: Math.round(start + (end - start) * t),
      y: heights[j],
    });
  });
}

export const BG_W = Math.round(LEVEL_W * 0.3 + 2400);
export const CLOUDS = Array.from({ length: Math.ceil(BG_W / 240) }, (_, i) => ({
  id: i,
  left: i * 240 + (i % 3) * 40,
  top: 25 + (i % 4) * 32,
  size: 44 + (i % 3) * 18,
}));
