import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  text: {
    color: "black",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 30,
    marginRight: 5,
  },
  footerContentContainer: {
    height: "100%",
    width: "40%",
  },
  footerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLink: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default style;
