import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: ({ inverted, color }) => ({
    backgroundColor: inverted ? "transparent" : color,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    ...(inverted && {
      borderColor: color,
      borderWidth: 1,
    }),
  }),
  text: ({ inverted, color }) => ({
    color: inverted ? color : "white",
    fontSize: 15,
  }),
});

export default style;
