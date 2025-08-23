/** Contants */
const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];
const TONS = { GREEN: 400, RED: 100, BLUE: 200, YELLOW: 300 };

/** Variables */
var lvlOption = 1;
var gameSequence;
var currentStep = 0;
var currentClick = 0;
var synth = null;
// var bestScore = 0;

/** Utils */
const getNewSequence = (quantity) =>
  new Array(quantity).fill().map(() => VALUES[Math.floor(Math.random() * 4)]);
const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Elements */
const startMenu = document.getElementById("game-start");
const hiddenBackground = document.getElementById("hidden-background");
const lblScore = document.getElementById("lbl-score");
const winContainer = document.getElementById("game-won");
const gameOver = document.getElementById("game-over");

// const currentScoreValue = document.getElementById("current-score-value");
// const bestScoreValue = document.getElementById("best-score-value");

/** Game Start Functions */
const handlePressButton = (item) => {
  if (gameSequence[currentClick] === item) {
    currentClick++;
    handleButtonEffect(item);
    checkIfSequenceComplete();
  } else {
    handleGameOver();
  }
};

const handleButtonEffect = (color) => {
  const button = getButton(color);
  const ton = TONS[color];

  /** Initialize audio on first button press */
  initAudio();

  if (synth) {
    synth.triggerAttackRelease(ton, "8n");
  }

  button.classList.add("pressed");

  setTimeout(() => {
    button.classList.remove("pressed");
  }, 400);
};

const toggleButtons = (disabled, pointer) => {
  VALUES.forEach((color) => {
    const button = getButton(color);
    button.disabled = disabled;
    button.style.pointerEvents = pointer;
  });
};

const checkIfSequenceComplete = () => {
  if (currentClick > currentStep) {
    currentClick = 0;
    if (++currentStep === gameSequence.length) {
      // updateBestScore(currentStep);
      handleYouWin();
    } else {
      handleGameSequence();
    }
  }
};

const handleGameSequence = async () => {
  lblScore.textContent = `${currentStep}`;
  // currentScoreValue.textContent = `${currentStep}`;
  toggleButtons(true, "none");

  setTimeout(async () => {
    for (var i = 0; i <= currentStep; i++) {
      handleButtonEffect(gameSequence[i]);
      await delay(700);
    }
    toggleButtons(false, "auto");
  }, 1000);
};

/** Game Finished */
const handleYouWin = () => {
  createConfetti();
  hiddenBackground.style.display = "flex";
  toggleButtons(true, "none");
  currentStep = 0;
  currentClick = 0;

  winContainer.style.display = "flex";

  setTimeout(() => {
    winContainer.style.display = "none";
    startMenu.style.display = "flex";
    startMenu.style.flexDirection = "column";
  }, 3000);
};

const handleGameOver = () => {
  gameOver.style.display = "flex";
  hiddenBackground.style.display = "flex";
  toggleButtons(true, "none");
  currentStep = 0;
  currentClick = 0;
};

/** Audio */
const initAudio = () => {
  if (!synth) {
    synth = new Tone.Synth().toDestination();
    // Resume audio context
    if (Tone.context.state !== "running") {
      Tone.context.resume();
    }
  }
};

/** Confetti */
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

/** Menu Game Start */
const menuOptions = document.querySelectorAll("#game-options > div");
const arrows = document.querySelectorAll("#game-options span");

const handleStart = () => {
  startMenu.classList.add("hide");
  gameSequence = getNewSequence(lvlOption * 10);
  handleGameSequence();
  setTimeout(() => {
    startMenu.style.display = "none";
    hiddenBackground.style.display = "none";
  }, 300);
};

menuOptions.forEach((option, key) => {
  option.addEventListener("mouseenter", () => {
    lvlOption = key + 1;
    menuOptions.forEach((el) => el.classList.remove("selected"));
    option.classList.add("selected");
    arrows.forEach((el) => el.classList.remove("selected"));
    arrows[key * 2].classList.add("selected");
    arrows[key * 2 + 1].classList.add("selected");
  });
  option.addEventListener("click", handleStart);
});

VALUES.forEach((color) => {
  const button = getButton(color);
  button.addEventListener("click", () => {
    handlePressButton(color);
  });
});

/** Replay */
const btnReplay = document.getElementById("btn-replay");

const handleReplay = () => {
  gameSequence = getNewSequence(lvlOption * 10);
  handleGameSequence();
  hiddenBackground.style.display = "none";
  gameOver.style.display = "none";
};

btnReplay.addEventListener("click", handleReplay);
