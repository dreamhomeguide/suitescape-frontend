import { Alert } from "react-native";

const MAX_WHOLE_LENGTH = 8;
const MAX_DECIMAL_LENGTH = 2;

export const MAX_PRICE_LENGTH = MAX_WHOLE_LENGTH + MAX_DECIMAL_LENGTH + 2;

const checkIfValidPrice = (price) => {
  if (isNaN(price)) {
    return false;
  }

  const [whole, decimal] = price.toString().split(".");
  const isWholeLengthValid = whole.length <= MAX_WHOLE_LENGTH;
  const isDecimalLengthValid = !decimal || decimal.length <= MAX_DECIMAL_LENGTH;

  if (!isWholeLengthValid) {
    Alert.alert(
      `The whole part of the price should not exceed ${MAX_WHOLE_LENGTH} digits.`,
    );
  }

  if (!isDecimalLengthValid) {
    Alert.alert(
      `The decimal part of the price should not exceed ${MAX_DECIMAL_LENGTH} digits.`,
    );
  }

  return isWholeLengthValid && isDecimalLengthValid;
};

export default checkIfValidPrice;
