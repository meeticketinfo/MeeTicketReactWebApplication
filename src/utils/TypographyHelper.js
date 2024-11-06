export const toTitleCase = (text) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const toUpperCase = (text) => {
  return text.toUpperCase();
};

export const toLowerCase = (text) => {
  return text.toLowerCase();
};
