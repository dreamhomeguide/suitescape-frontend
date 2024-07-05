import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  switchContainer: {
    ...globalStyles.buttonRowSmall,
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  switchLabel: {
    color: "white",
  },
  gradient: {
    height: "20%",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default style;
