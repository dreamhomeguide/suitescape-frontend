import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  headerIconContainer: ({ topInsets, right }) => ({
    position: "absolute",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 30,
    zIndex: 1,
    top: topInsets + 15,
    ...(right && { right: 0 }),
  }),
});

export default style;
