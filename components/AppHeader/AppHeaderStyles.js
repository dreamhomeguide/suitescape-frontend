import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  headerContainer: {
    // height: 95,
    justifyContent: "space-between",
    paddingBottom: 5,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    zIndex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    columnGap: 20,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
});

export default style;
