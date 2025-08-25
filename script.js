/** Contants */
const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];
const TONS = { GREEN: 400, RED: 100, BLUE: 200, YELLOW: 300 };

/** Variables */
var lvlOption = 1;
var gameSequence;
var currentStep = 0;
var currentClick = 0;
var synth = null;

/** Local Storage Keys */
const STORAGE_KEYS = {
  VICTORIES: "memoryGame_victories",
  BEST_SCORE: "memoryGame_bestScore",
};

/** Local Storage Functions */
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

const updateVictories = () => {
  const currentVictories = loadFromLocalStorage(STORAGE_KEYS.VICTORIES, 0);
  const newVictories = currentVictories + 1;
  saveToLocalStorage(STORAGE_KEYS.VICTORIES, newVictories);

  // Update display
  const victoriesElement = document.getElementById("victories-value");
  if (victoriesElement) {
    victoriesElement.textContent = newVictories;
  }
};

const updateBestScore = (newScore) => {
  const currentBestScore = loadFromLocalStorage(STORAGE_KEYS.BEST_SCORE, 0);

  // In free style mode, newScore represents the sequence length achieved
  // In fixed mode, newScore represents the sequence length completed
  if (newScore > currentBestScore) {
    saveToLocalStorage(STORAGE_KEYS.BEST_SCORE, newScore);

    // Update display
    const bestScoreElement = document.getElementById("best-score-value");
    if (bestScoreElement) {
      bestScoreElement.textContent = newScore;
    }
  }
};

const loadGameStats = () => {
  // Load victories
  const victories = loadFromLocalStorage(STORAGE_KEYS.VICTORIES, 0);
  const victoriesElement = document.getElementById("victories-value");
  if (victoriesElement) {
    victoriesElement.textContent = victories;
  }

  // Load best score
  const bestScore = loadFromLocalStorage(STORAGE_KEYS.BEST_SCORE, 0);
  const bestScoreElement = document.getElementById("best-score-value");
  if (bestScoreElement) {
    bestScoreElement.textContent = bestScore;
  }
};

/** Utils */
const getNewSequence = (quantity) =>
  new Array(quantity).fill().map(() => VALUES[Math.floor(Math.random() * 4)]);
const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Elements */
const lblScore = document.getElementById("lbl-score");
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
      if (lvlOption === "free") {
        // Free style mode: add one more sequence and continue
        gameSequence.push(VALUES[Math.floor(Math.random() * 4)]);
        triggerGameSequence();
      } else {
        // Fixed sequence mode: check if game is won
        handleYouWin();
      }
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

  // Add you-win class to the board to show "YOU WIN!" text
  gameBoard.classList.add("you-win");

  updateVictories();
  updateBestScore(currentStep);
  setTimeout(() => {
    resetGame();
    // Reset side menu selection
    sideMenuOptions.forEach((opt) => opt.classList.remove("active"));
  }, 3000);
};

const handleGameOver = () => {
  // Add game-over class to the board to show "GAME OVER" text
  gameBoard.classList.add("game-over");

  toggleButtons(true, "none");

  updateBestScore(currentStep);
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
const sideMenuOptions = document.querySelectorAll("#side-menu .lvl-option");
const sideMenuArrows = document.querySelectorAll("#side-menu .arrow");

const startGame = () => {
  // Enable game board
  gameBoard.classList.remove("disabled");

  // Remove game-over and you-win classes if they exist
  gameBoard.classList.remove("game-over");
  gameBoard.classList.remove("you-win");

  // Initialize game
  if (lvlOption === "free") {
    // Free style mode: start with 1 sequence and add more as player progresses
    gameSequence = getNewSequence(1);
  } else {
    // Fixed sequence mode
    gameSequence = getNewSequence(lvlOption * 10);
  }
  currentStep = 0;
  currentClick = 0;

  // Start first sequence
  triggerGameSequence();
};

const resetGame = () => {
  // Disable game board
  gameBoard.classList.add("disabled");

  // Remove game-over and you-win classes if they exist
  gameBoard.classList.remove("game-over");
  gameBoard.classList.remove("you-win");

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
  if (option.dataset.sequences === "free") {
    lvlOption = "free";
  } else {
    lvlOption = parseInt(option.dataset.sequences) / 10;
  }

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

// Load game stats from localStorage when page loads
loadGameStats();
