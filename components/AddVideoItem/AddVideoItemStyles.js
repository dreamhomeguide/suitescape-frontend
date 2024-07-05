import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  buttonsContainer: {
    ...globalStyles.buttonRowSmall,
    position: "absolute",
    top: 10,
    right: 10,
  },
  button: {
    padding: 5,
  },
});

export default style;
