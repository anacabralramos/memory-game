/** Contants */
const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];
const TONS = { GREEN: 400, RED: 100, BLUE: 200, YELLOW: 300 };

/** Variables */
var lvlOption = 1;
var gameSequence;
var currentStep = 0;
var currentClick = 0;
var synth = null;

/** Utils */
const getNewSequence = (quantity) =>
  new Array(quantity).fill().map(() => VALUES[Math.floor(Math.random() * 4)]);
const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Elements */
const lblScore = document.getElementById("lbl-score");
const winContainer = document.getElementById("game-won");
const gameOver = document.getElementById("game-over");
const gameBoard = document.querySelector(".game-board");

/** Game Start Functions */
const handlePressButton = (item) => {
  if (gameSequence && gameSequence[currentClick] === item) {
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
      handleYouWin();
    } else {
      triggerGameSequence();
    }
  }
};

const triggerGameSequence = async () => {
  lblScore.textContent = `${currentStep}`;
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
  toggleButtons(true, "none");

  winContainer.style.display = "flex";

  setTimeout(() => {
    winContainer.style.display = "none";
    resetGame();
    // Reset side menu selection
    sideMenuOptions.forEach((opt) => opt.classList.remove("active"));
  }, 3000);
};

const handleGameOver = () => {
  gameOver.style.display = "flex";
  toggleButtons(true, "none");
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

/** Replay */
const btnReplay = document.getElementById("btn-replay");

const handleReplay = () => {
  // Reset game state
  currentStep = 0;
  currentClick = 0;

  // Generate new sequence with current level
  gameSequence = getNewSequence(lvlOption * 10);

  // Start game sequence
  triggerGameSequence();

  // Hide overlays
  gameOver.style.display = "none";
};

btnReplay.addEventListener("click", handleReplay);

/** Menu Game Start */
const sideMenuOptions = document.querySelectorAll("#side-menu .lvl-option");
const sideMenuArrows = document.querySelectorAll("#side-menu .arrow");

const startGame = () => {
  // Enable game board
  gameBoard.classList.remove("disabled");

  // Initialize game
  gameSequence = getNewSequence(lvlOption * 10);
  currentStep = 0;
  currentClick = 0;

  // Start first sequence
  triggerGameSequence();
};

const resetGame = () => {
  // Disable game board
  gameBoard.classList.add("disabled");

  // Reset game state
  gameSequence = null;
  currentStep = 0;
  currentClick = 0;
  lblScore.textContent = "0";
};

const handleStartNewSequence = (option) => {
  // Remove active class from all options
  sideMenuOptions.forEach((opt) => {
    opt.classList.remove("active");
  });

  // Add active class to selected option
  option.classList.add("active");

  // Update level option
  lvlOption = parseInt(option.dataset.sequences) / 10;

  // If game is already running, restart with new sequence length
  if (gameSequence) {
    resetGame();
  }
  // Start the game for the first time
  startGame();
};

// Add event listeners for side menu options
sideMenuOptions.forEach((option) => {
  option.addEventListener("click", () => handleStartNewSequence(option));
});

// Initialize game board as disabled
gameBoard.classList.add("disabled");

VALUES.forEach((color) => {
  const button = getButton(color);
  button.addEventListener("click", () => {
    handlePressButton(color);
  });
});
