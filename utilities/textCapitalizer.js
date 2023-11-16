const capitalizedText = (text, all = false) => {
  if (all) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default capitalizedText;
