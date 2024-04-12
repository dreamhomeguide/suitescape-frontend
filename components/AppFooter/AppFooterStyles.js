import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: ({ enableInsets, bottomInsets }) => ({
    paddingTop: 14,
    paddingBottom: (enableInsets ? bottomInsets : 0) + 14,
    paddingHorizontal: 23,
  }),
  transparentFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footer: ({ colors }) => ({
    borderTopWidth: 1,
    backgroundColor: colors.background,
    borderTopColor: colors.border,
  }),
});

export default style;
