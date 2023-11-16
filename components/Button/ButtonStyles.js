import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  button: (color) => ({
    backgroundColor: color,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  }),
  text: {
    color: "white",
    fontWeight: "bold",
  },
  blueText: {
    color: Colors.blue,
  },
  outlinedButton: (color) => ({
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: color,
  }),
  invertedButton: {
    backgroundColor: "transparent",
  },
});

export default style;
