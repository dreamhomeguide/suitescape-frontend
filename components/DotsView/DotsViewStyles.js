import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  dot: (size, focused) => ({
    margin: 4,
    height: size,
    width: focused ? size * 2 : size,
    backgroundColor: focused ? Colors.blue : Colors.lightblue,
    borderRadius: size,
  }),
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default style;
