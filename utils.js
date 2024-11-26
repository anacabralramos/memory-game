export const VALUES = ["GREEN", "RED", "BLUE", "YELLOW"];
export const TONS = { GREEN: 400, RED: 100, BLUE: 200, YELLOW: 300 };

export const getNewSequence = () =>
  new Array(5).fill().map(() => VALUES[Math.floor(Math.random() * 4)]);

export const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
