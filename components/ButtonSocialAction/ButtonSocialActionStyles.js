import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  socialButtonContentContainer: {
    flex: 1,
    borderWidth: 0.2,
    borderColor: "lightgrey",
    borderBottomWidth: 0,
  },
  socialButton: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
