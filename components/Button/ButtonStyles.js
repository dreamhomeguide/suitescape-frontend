import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  button: ({ outlined, inverted, color }) => ({
    backgroundColor: outlined || inverted ? "transparent" : color,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    ...(outlined && { borderWidth: 1, borderColor: color }),
  }),
  text: ({ outlined, inverted, color }) => ({
    color: outlined || inverted ? color : "white",
    fontWeight: "bold",
  }),
});

export default style;
