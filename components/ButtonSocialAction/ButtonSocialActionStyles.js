import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  socialButtonContentContainer: {
    flex: 1,
    borderColor: "lightgrey",
    borderWidth: 0.2,
    borderBottomWidth: 0,
  },
  socialButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonText: ({ textColor }) => ({
    color: textColor,
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingLeft: 10,
  }),
  icon: {
    paddingBottom: 4,
  },
});

export default style;
