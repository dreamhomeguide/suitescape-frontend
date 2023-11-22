import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  headerContainer: ({ bgColor, borderColor }) => ({
    // height: 95,
    justifyContent: "space-between",
    paddingBottom: 5,
    left: 0,
    right: 0,
    backgroundColor: bgColor,
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    zIndex: 1,
  }),
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
  text: ({ textColor }) => ({
    color: textColor,
    fontSize: 16,
  }),
});

export default style;
