import { delay, getButton, getNewSequence, VALUES, TONS } from "./utils.js";

var currentStep = 0;
var currentClick = 0;
var sequenceOption = 1;
var originalSequence;

const hiddenBackground = document.getElementById("hidden-background");
const lblScore = document.getElementById("lbl-score");
const gameOver = document.getElementById("game-over");
const start = document.getElementById("game-start");
const options = document.querySelectorAll("#menu-options li");
const arrows = document.querySelectorAll("#menu-options span");
const winContainer = document.getElementById("game-won");

const btnReplay = document.getElementById("btn-replay");
const synth = new Tone.Synth().toDestination();

const createConfetti = () => {
  const confettiContainer = document.getElementById("confetti-container");

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = "0";
    confetti.style.bottom = "0";
    confetti.style.setProperty("--confetti-x", `${Math.random() * 100}vw`);
    confetti.style.animationDelay = `${Math.random()}s`;
    confettiContainer.appendChild(confetti);
  }

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.right = "0";
    confetti.style.bottom = "0";
    confetti.style.setProperty("--confetti-x", `-${Math.random() * 100}vw`);
    confetti.style.animationDelay = `${Math.random()}s`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 5000);
};

// gamer press
const handlePressButton = (item) => {
  if (originalSequence[currentClick] === item) {
    currentClick++;
    handleButtonEffect(item);
    checkIfSequenceComplete();
  } else {
    handleGameOver();
  }
};

const checkIfSequenceComplete = () => {
  if (currentClick > currentStep) {
    currentClick = 0;
    if (++currentStep === originalSequence.length) {
      handleYouWin();
    } else {
      handleGameSequence();
    }
  }
};

const handleYouWin = () => {
  createConfetti();
  hiddenBackground.style.display = "flex";
  toggleButtons(true, "none");
  currentStep = 0;
  currentClick = 0;

  winContainer.style.display = "flex";

  setTimeout(() => {
    winContainer.style.display = "none";
    start.style.display = "flex";
    start.style.flexDirection = "column";
  }, 3000);
};

const handleGameOver = () => {
  gameOver.style.display = "flex";
  hiddenBackground.style.display = "flex";
  toggleButtons(true, "none");
  currentStep = 0;
  currentClick = 0;
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
  const ton = TONS[color];
  synth.triggerAttackRelease(ton, "8n");
  button.classList.add("pressed");

  setTimeout(() => {
    button.classList.remove("pressed");
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
  start.classList.add("hide");
  originalSequence = getNewSequence(sequenceOption * 10);
  handleGameSequence();
  setTimeout(() => {
    start.style.display = "none";
    hiddenBackground.style.display = "none";
  }, 300);
};

// game replay
const handleReplay = () => {
  originalSequence = getNewSequence(sequenceOption * 10);
  handleGameSequence();
  hiddenBackground.style.display = "none";
  gameOver.style.display = "none";
};

btnReplay.addEventListener("click", handleReplay);

options.forEach((item, key) => {
  item.addEventListener("mouseover", () => {
    arrows.forEach((el) => el.classList.remove("selected"));
    options.forEach((el) => el.classList.remove("selected"));
    sequenceOption = key + 1;
    item.classList.add("selected");
    arrows[key * 2].classList.add("selected");
    arrows[key * 2 + 1].classList.add("selected");
  });
  item.addEventListener("click", handleStart);
});

VALUES.forEach((color) => {
  const button = getButton(color);
  button.addEventListener("click", () => {
    handlePressButton(color);
  });
});
