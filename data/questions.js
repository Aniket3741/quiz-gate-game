

export const TOPIC_NAME = "The Solar System";

const questions = [
  {
    context:
      "The Sun is a star at the center of our solar system. It is so massive that its pull keeps every planet travelling around it.",
    question: "Which force keeps the planets moving in orbits around the Sun?",
    options: ["Magnetism", "Gravity", "Friction", "Wind"],
    correctIndex: 1,
    explanation:
      "Gravity is the pulling force between objects with mass. The Sun's strong gravity holds the planets in their orbits.",
  },
  {
    context:
      "Our solar system has eight planets. Some are small and rocky, while others are giant worlds made mostly of gas.",
    question: "Which is the largest planet in our solar system?",
    options: ["Jupiter", "Earth", "Mercury", "Mars"],
    correctIndex: 0,
    explanation:
      "Jupiter is a gas giant so big that more than 1,300 Earths could fit inside it.",
  },
  {
    context:
      "Earth spins like a top around an imaginary line called its axis. One full spin takes about 24 hours.",
    question: "What does the spinning (rotation) of Earth cause?",
    options: ["The seasons", "Moon phases", "Ocean waves", "Day and night"],
    correctIndex: 3,
    explanation:
      "As Earth rotates, the side facing the Sun has daytime while the side facing away has night.",
  },
  {
    context:
      "Earth's axis is tilted by about 23.5 degrees. While Earth travels around the Sun during one year, different areas receive more direct sunlight at different times.",
    question: "What causes the seasons on Earth?",
    options: [
      "Earth moving much closer to and farther from the Sun",
      "The Moon blocking sunlight",
      "The tilt of Earth's axis",
      "Clouds moving around the planet",
    ],
    correctIndex: 2,
    explanation:
      "The tilt means the hemisphere tipped toward the Sun gets summer, while the one tipped away gets winter.",
  },
  {
    context:
      "Mars is covered with dust and rocks that contain iron. When iron rusts, it turns reddish, and this gives the planet a distinctive color.",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Saturn", "Neptune"],
    correctIndex: 1,
    explanation:
      "Rusty iron dust on the surface of Mars makes the planet look red when viewed from Earth.",
  },
];

export default questions;
