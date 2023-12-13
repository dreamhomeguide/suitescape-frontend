import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
  },
  logoText: ({ textColor, bold }) => ({
    color: textColor,
    fontFamily: bold ? "Agenor-Bold" : "Agenor-Thin",
    letterSpacing: 0.15,
    fontSize: 40,
    textTransform: "uppercase",
    includeFontPadding: false,
  }),
});

export default style;
