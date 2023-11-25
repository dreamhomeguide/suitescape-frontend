const extractNumber = (input, onSuccess) => {
  if (input === "") {
    onSuccess && onSuccess(null);
    return;
  }

  const formatted = input.replace(/\D/, "");

  if (formatted === "") {
    return;
  }

  const numberValue = Number(formatted);

  if (isNaN(numberValue)) {
    return;
  }

  onSuccess && onSuccess(numberValue);
};

export default extractNumber;
