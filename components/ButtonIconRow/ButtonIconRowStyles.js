import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  button: ({ gap, reverse }) => ({
    alignItems: "center",
    flexDirection: "row",
    columnGap: gap,
    ...(reverse && {
      flexDirection: "row-reverse",
      justifyContent: "flex-end",
    }),
  }),
});

export default style;
