import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  text: {
    color: "black",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 20,
  },
  footerContentContainer: {
    flex: 2,
    paddingRight: 40,
  },
  footerContent: {
    rowGap: 3,
    alignItems: "center",
  },
  footerButton: {
    flex: 3,
  },
  footerLink: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default style;
