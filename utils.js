export const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
