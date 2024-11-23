export const getButton = (color) =>
  document.getElementById(`btn-${color.toLowerCase()}`);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const toggleButtons = (disabled, pointer) => {
  VALUES.forEach((color) => {
    const button = getButton(color);
    button.disabled = disabled;
    button.style.pointerEvents = pointer;
  });
};
