import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  row: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    color: "black",
    fontSize: 15,
  },
  checkbox: {
    borderColor: "gray",
  },
  bottomSheet: {
    paddingTop: 10,
  },
});

export default style;
