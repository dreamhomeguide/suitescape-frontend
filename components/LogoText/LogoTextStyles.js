import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 25,
  },
  logoText: ({ textColor, bold }) => ({
    color: textColor,
    fontFamily: bold ? "Poppins_700Bold" : "Poppins_400Regular",
    letterSpacing: 0.15,
    fontSize: 45,
    textTransform: "uppercase",
    includeFontPadding: false,
  }),
});

export default style;
