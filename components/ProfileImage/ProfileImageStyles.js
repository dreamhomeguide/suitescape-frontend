import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: ({ fillColor, borderColor, borderWidth, size }) => ({
    borderColor,
    borderWidth,
    borderRadius: size * 2,
    backgroundColor: fillColor,
    width: size,
    height: size,
  }),
});

export default style;
