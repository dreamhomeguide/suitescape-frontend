import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  footerContainer: ({ bottomInsets, bgColor, borderColor }) => ({
    backgroundColor: bgColor,
    borderTopWidth: 1,
    borderTopColor: borderColor,
    paddingTop: 12,
    paddingHorizontal: 23,
    paddingBottom: bottomInsets + 12,
  }),
});

export default style;
