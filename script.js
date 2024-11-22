// const text = "JOGO DA MEMORIA";
// document.getElementById("text").textContent = text;

const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];
var currentStep = 0;
var currentClick = 0;

const start = document.getElementById("start");
const greenBtn = document.getElementById("btn-green");
const redBtn = document.getElementById("btn-red");
const blueBtn = document.getElementById("btn-blue");
const yellowBtn = document.getElementById("btn-yellow");

VALUES.forEach((color) => {
  const button = document.getElementById(`btn-${color.toLowerCase()}`);

  button.addEventListener("click", async function () {
    button.style.pointerEvents = "none";
    await handlePressButton(color);
    button.style.pointerEvents = "auto";
  });
});

const originalSequence = new Array(5)
  .fill()
  .map(() => VALUES[Math.floor(Math.random() * 4)]);

const toggleButtons = (disabled, pointer) => {
  greenBtn.disabled = disabled;
  greenBtn.style.pointerEvents = pointer;
  redBtn.disabled = disabled;
  redBtn.style.pointerEvents = pointer;
  blueBtn.disabled = disabled;
  blueBtn.style.pointerEvents = pointer;
  yellowBtn.disabled = disabled;
  yellowBtn.style.pointerEvents = pointer;
};

const handlePressButton = async (item) => {
  if (originalSequence[currentClick] === item) {
    currentClick++;
    await mapColors(item);
    checkIfSequenceComplete();
  } else {
    alert("Você errou!");
    resetGame();
  }
};

const checkIfSequenceComplete = () => {
  if (currentClick > currentStep) {
    currentClick = 0;
    if (++currentStep === originalSequence.length) {
      currentStep = 0;
      start.style.display = "block";
    } else {
      handleGameSequence();
    }
  }
};

const resetGame = () => {
  currentStep = 0;
  currentClick = 0;
  originalSequence = new Array(3)
    .fill()
    .map(() => VALUES[Math.floor(Math.random() * 4)]);
  start.style.display = "block";
};

const handleButtonBrightness = (button, style) => {
  button.classList.add(style);
  return new Promise((resolve) => {
    setTimeout(() => {
      button.classList.remove(style);
      resolve();
    }, 400);
  });
};

const mapColors = async (color) => {
  switch (color) {
    case "GREEN":
      await handleButtonBrightness(greenBtn, "btn-green-pressed");
      break;
    case "RED":
      await handleButtonBrightness(redBtn, "btn-red-pressed");
      break;
    case "BLUE":
      await handleButtonBrightness(blueBtn, "btn-blue-pressed");
      break;
    case "YELLOW":
      await handleButtonBrightness(yellowBtn, "btn-yellow-pressed");
      break;
  }
};

// game sequence
const handleGameSequence = async () => {
  toggleButtons(true, "none");

  setTimeout(async () => {
    for (var i = 0; i <= currentStep; i++) {
      await mapColors(originalSequence[i]);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    toggleButtons(false, "auto");
  }, 1000);
};

// game start
const handleStart = () => {
  start.style.display = "none";
  handleGameSequence();
};
