const text = "JOGO DA MEMORIA";
document.getElementById("text").textContent = text;

const init = document.getElementById("init");
const greenBtn = document.getElementById("btn-green");
const redBtn = document.getElementById("btn-red");
const blueBtn = document.getElementById("btn-blue");
const yellowBtn = document.getElementById("btn-yellow");

var currentStep = 0;
var currentClick = 0;

const originalSequence = [
  "GREEN",
  "RED",
  "BLUE",
  "YELLOW",
  "GREEN",
  "RED",
  "BLUE",
  "YELLOW",
  "GREEN",
  "RED",
  "BLUE",
  "YELLOW",
  "GREEN",
  "RED",
  "YELLOW",
];

const handleDisableButtons = (value) => {
  greenBtn.disabled = value;
  redBtn.disabled = value;
  blueBtn.disabled = value;
  yellowBtn.disabled = value;
};

const handlePressButton = (item) => {
  if (originalSequence[currentClick] === item) {
    currentClick++;
  } else {
    return alert("errou");
  }
  if (currentClick > currentStep) {
    currentClick = 0;
    if (++currentStep === originalSequence.length) {
      currentStep = 0;
      return (init.style.display = "block");
    }
    handleGameTime();
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

const handleGameTime = async () => {
  handleDisableButtons(true);
  for (var i = 0; i <= currentStep; i++) {
    switch (originalSequence[i]) {
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
  }
  handleDisableButtons(false);
};

const handleStart = () => {
  init.style.display = "none";
  handleGameTime();
};
