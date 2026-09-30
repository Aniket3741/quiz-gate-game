# Quiz Quest - Educational Question Gate Game (Next.js + React)

Run, jump, touch a gate, answer the MCQ. Correct = gate opens. Wrong = back to the start.

## Run it
```bash
npm install
npm run dev        # open http://localhost:3000
```
Production: `npm run build && npm start`. Deploy free on Vercel (import the folder, no settings needed).

## Controls
- Keyboard: Arrow keys or A / D to move, Space / W / Up to jump
- Phone / tablet: on-screen buttons (◀ ▶ and jump)

## Change the topic (the only file you must edit)
Open `data/questions.js`. Each object is one gate:
```js
{
  context: "Short lesson text shown above the question.",
  question: "The full question?",
  options: ["A", "B", "C", "D"],   // always 4 options
  correctIndex: 1,                  // 0=A, 1=B, 2=C, 3=D
  explanation: "Shown after the player answers.",
}
```
Add or remove objects and the level builds the matching number of gates automatically. Also change `TOPIC_NAME` at the top of the file.

## Project structure
```
app/
  layout.js, page.js, globals.css   Next.js entry + all styles
components/
  Game.js            Main game: state, game loop, gate logic, reset
  GameStage.js       Draws level (sky, ground, gates, stars, player) and scales to screen
  QuestionModal.js   MCQ panel with 4 options + feedback
  HUD.js             Progress, score, stars, attempts, mute, restart
  TouchControls.js   On-screen buttons for mobile
  StartScreen.js / WinScreen.js
hooks/
  useSound.js        Music + sound effects (Web Audio API, no files needed)
data/
  questions.js       All questions/answers (one per gate)
lib/
  level.js           Level size, gate positions, speed, gravity, stars
```

## How the requirements are met
| Requirement | Where |
|---|---|
| Movement + jump | `Game.js` -> `update()` |
| Gate touch opens MCQ | `Game.js` gate collision loop -> `QuestionModal.js` |
| 4 clickable options | `QuestionModal.js` |
| Correct: panel closes, gate opens | `handleCorrect()` in `Game.js` |
| Wrong: restart from beginning | `handleWrong()` -> `resetGame()` (all gates lock again) |
| Unique question per gate | `data/questions.js` (gate i uses question i) |

## Use your own audio files (optional)
Put `music.mp3` in `public/` and in `useSound.js` replace the melody with:
```js
const music = new Audio("/music.mp3"); music.loop = true; music.volume = 0.4; music.play();
```

## Demo video script (60-90 seconds)
1. Show Start screen, click Start.
2. Run, jump, collect stars.
3. Touch Gate 1: MCQ appears. Choose a correct answer: gate lifts open.
4. Reach Gate 2 or 3, choose a wrong answer: shake + explanation, click Restart: back at the start with all gates locked.
5. Complete all gates, reach the flag: Level complete screen.
6. Resize the browser (or use phone view) to show responsiveness.
