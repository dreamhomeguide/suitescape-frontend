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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    columnGap: 2,
    left: -10,
  },
  headerLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomSheet: {
    paddingTop: 10,
  },
  flatList: {
    paddingVertical: 15,
  },
});

export default style;
