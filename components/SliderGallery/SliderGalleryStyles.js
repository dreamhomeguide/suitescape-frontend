import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  emptyContainer: ({ width }) => ({
    width,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 10,
  }),
});

export default style;
