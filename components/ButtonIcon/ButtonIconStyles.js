import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  button: ({ bgColor, disabled }) => ({
    backgroundColor: bgColor,
    opacity: disabled ? 0.25 : 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 55,
  }),
});

export default style;
