import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  button: ({ bgColor }) => ({
    backgroundColor: bgColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 55,
  }),
});

export default style;
