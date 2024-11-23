import { delay, getButton } from "./utils.js";

const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];
var currentStep = 0;
var currentClick = 0;
const originalSequence = new Array(5)
  .fill()
  .map(() => VALUES[Math.floor(Math.random() * 4)]);

const lblScore = document.getElementById("lbl-score");
const start = document.getElementById("start");
const btnStart = document.getElementById("btn-start");

// gamer press
const handlePressButton = (item) => {
  if (originalSequence[currentClick] === item) {
    currentClick++;
    handleButtonEffect(item);
    checkIfSequenceComplete();
  } else {
    resetGame();
  }
};

const checkIfSequenceComplete = () => {
  if (currentClick > currentStep) {
    currentClick = 0;
    if (++currentStep === originalSequence.length) {
      currentStep = 0;
      start.style.display = "flex";
    } else {
      handleGameSequence();
    }
  }
};

const resetGame = () => {
  // TODO: tela vermelha talvez
  currentStep = 0;
  currentClick = 0;
  originalSequence = new Array(3)
    .fill()
    .map(() => VALUES[Math.floor(Math.random() * 4)]);
  start.style.display = "block";
};

const toggleButtons = (disabled, pointer) => {
  VALUES.forEach((color) => {
    const button = getButton(color);
    button.disabled = disabled;
    button.style.pointerEvents = pointer;
  });
};

const handleButtonEffect = (color) => {
  const button = getButton(color);
  const styles = `btn-${color.toLowerCase()}-pressed`;

  button.classList.add(styles);

  setTimeout(() => {
    button.classList.remove(styles);
  }, 400);
};

// game sequence
const handleGameSequence = async () => {
  lblScore.textContent = `${currentStep}`;
  toggleButtons(true, "none");

  setTimeout(async () => {
    for (var i = 0; i <= currentStep; i++) {
      handleButtonEffect(originalSequence[i]);
      await delay(700);
    }
    toggleButtons(false, "auto");
  }, 1000);
};

// game start
const handleStart = () => {
  start.style.display = "none";
  handleGameSequence();
};

btnStart.addEventListener("click", handleStart);

VALUES.forEach((color) => {
  const button = getButton(color);
  button.addEventListener("click", () => {
    handlePressButton(color);
  });
});
