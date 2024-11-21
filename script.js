// const text = "JOGO DA MEMORIA";
// document.getElementById("text").textContent = text;

const start = document.getElementById("start");
const greenBtn = document.getElementById("btn-green");
const redBtn = document.getElementById("btn-red");
const blueBtn = document.getElementById("btn-blue");
const yellowBtn = document.getElementById("btn-yellow");

greenBtn.addEventListener("click", async function () {
  greenBtn.style.pointerEvents = "none";
  await handlePressButton("GREEN");
  greenBtn.style.pointerEvents = "auto";
});

redBtn.addEventListener("click", async function () {
  redBtn.style.pointerEvents = "none";
  await handlePressButton("RED");
  redBtn.style.pointerEvents = "auto";
});

yellowBtn.addEventListener("click", async function () {
  yellowBtn.style.pointerEvents = "none";
  await handlePressButton("YELLOW");
  yellowBtn.style.pointerEvents = "auto";
});

blueBtn.addEventListener("click", async function () {
  blueBtn.style.pointerEvents = "none";
  await handlePressButton("BLUE");
  blueBtn.style.pointerEvents = "auto";
});

var currentStep = 0;
var currentClick = 0;

const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];

// const originalSequence = ["GREEN", "GREEN", "RED", "RED", "BLUE", "BLUE"];

const originalSequence = new Array(3)
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
  } else {
    return alert("errou");
  }
  if (currentClick > currentStep) {
    currentClick = 0;
    if (++currentStep === originalSequence.length) {
      currentStep = 0;
      return (start.style.display = "block");
    }
    handleGameSequence();
  }
};

const handleTurnButton = (button, style) => {
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
      await handleTurnButton(greenBtn, "btn-green-pressed");
      break;
    case "RED":
      await handleTurnButton(redBtn, "btn-red-pressed");
      break;
    case "BLUE":
      await handleTurnButton(blueBtn, "btn-blue-pressed");
      break;
    case "YELLOW":
      await handleTurnButton(yellowBtn, "btn-yellow-pressed");
      break;
  }
};

// game sequence
const handleGameSequence = async () => {
  toggleButtons(true, "none");

  setTimeout(async () => {
    for (var i = 0; i <= currentStep; i++) {
      await mapColors(originalSequence[i]);
    }
    toggleButtons(false, "auto");
  }, 1000);
};

// game start
const handleStart = () => {
  start.style.display = "none";
  handleGameSequence();
};
