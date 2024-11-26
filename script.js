import { delay, getButton, getNewSequence, VALUES, TONS } from "./utils.js";

var currentStep = 0;
var currentClick = 0;
var originalSequence;

const lblScore = document.getElementById("lbl-score");
const score = document.querySelector(".score");
const btnStart = document.getElementById("btn-start");
const hiddenBackground = document.getElementById("hiddenBackground");
const btnReplay = document.getElementById("replay");

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
      // TODO: restart
      // currentStep = 0;
      // start.style.display = "flex";
    } else {
      handleGameSequence();
    }
  }
};

const handleGameOver = () => {
  hiddenBackground.style.display = "flex";
  toggleButtons(true, "none");
  currentStep = 0;
  currentClick = 0;

  btnReplay.disabled = false;
  btnReplay.classList.add("show");
  score.style.transform = "translateY(-30px)";
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
  score.style.transform = "translateY(0)";
  hiddenBackground.style.display = "none";
};

btnStart.addEventListener("click", handleStart);
btnReplay.addEventListener("click", handleReplay);

VALUES.forEach((color) => {
  const button = getButton(color);
  button.addEventListener("click", () => {
    handlePressButton(color);
  });
});
