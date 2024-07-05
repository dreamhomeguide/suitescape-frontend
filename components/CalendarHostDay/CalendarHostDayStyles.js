import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  container: (marking) => ({
    width: "100%",
    height: 95,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: marking?.marked
      ? Colors.red
      : marking?.selected
        ? Colors.blue
        : Colors.lightgray,
    opacity: marking?.disabled ? 0.6 : 1,
    backgroundColor: marking?.disabled ? Colors.gray : undefined,
    borderRadius: 10,
  }),
  label: (state, marking) => ({
    textAlign: "center",
    fontSize: 16,
    color: state === "today" ? Colors.blue : "black",
    textDecorationLine: marking?.type === "blocked" ? "line-through" : "none",
  }),
  price: (isSpecialRate) => ({
    color: isSpecialRate ? Colors.red : "black",
    fontSize: 12,
    padding: 5,
  }),
});

export default style;
