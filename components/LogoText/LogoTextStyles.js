import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 25,
  },
  logoText: {
    fontFamily: "Poppins_400Regular",
    letterSpacing: 0.15,
    fontSize: 45,
    textTransform: "uppercase",
    includeFontPadding: false,
  },
  bold: {
    fontFamily: "Poppins_700Bold",
  },
});

export default style;
