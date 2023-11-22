import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  text: ({ color, textAlign }) => ({
    color,
    textAlign,
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 30,
    paddingVertical: 20,
  }),
});

export default style;
