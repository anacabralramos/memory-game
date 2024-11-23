export const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];

export const getNewSequence = () =>
  new Array(5).fill().map(() => VALUES[Math.floor(Math.random() * 4)]);

export const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
