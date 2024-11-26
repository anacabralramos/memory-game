import { delay, getButton, getNewSequence, VALUES, TONS } from "./utils.js";

var currentStep = 0;
var currentClick = 0;
var originalSequence;

const lblScore = document.getElementById("lbl-score");
const gameOver = document.getElementById("game-over");
const btnStart = document.getElementById("btn-start");
const hiddenBackground = document.getElementById("hiddenBackground");
const btnReplay = document.getElementById("replay");
const winContainer = document.getElementById("win-container");

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

const playTone = (frequency) => {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(frequency, "8n");
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
};

const handleGameOver = () => {
  gameOver.style.display = "flex";
  hiddenBackground.style.display = "flex";
  toggleButtons(true, "none");
  currentStep = 0;
  currentClick = 0;

  btnReplay.disabled = false;
  btnReplay.classList.add("show");
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
  playTone(ton);
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
  btnStart.classList.add("hide");
  originalSequence = getNewSequence();
  handleGameSequence();
  setTimeout(() => {
    btnStart.style.display = "none";
    hiddenBackground.style.display = "none";
  }, 300);
};

// game replay
const handleReplay = () => {
  originalSequence = getNewSequence();
  handleGameSequence();
  btnReplay.classList.remove("show");
  btnReplay.disabled = true;
  hiddenBackground.style.display = "none";
  gameOver.style.display = "none";
};

btnStart.addEventListener("click", handleStart);
btnReplay.addEventListener("click", handleReplay);

VALUES.forEach((color) => {
  const button = getButton(color);
  button.addEventListener("click", () => {
    handlePressButton(color);
  });
});
