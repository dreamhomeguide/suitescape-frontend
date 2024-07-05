const extractNumber = (input, number = true, onSuccess) => {
  if (input === "") {
    onSuccess && onSuccess(null);
    return;
  }

  // Allow digits and decimal points
  const formatted = input.replace(/[^0-9.]/g, "");

  if (formatted === "") {
    return;
  }

  // If value is not a number, return the formatted string
  if (!number) {
    onSuccess && onSuccess(formatted);
    return;
  }

  const numberValue = Number(formatted);

  if (isNaN(numberValue)) {
    return;
  }

  onSuccess && onSuccess(numberValue);
};

export default extractNumber;
