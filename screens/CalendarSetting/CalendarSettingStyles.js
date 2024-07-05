import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  contentContainer: {
    margin: 20,
    rowGap: 25,
  },
  container: {
    backgroundColor: Colors.lightgray,
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: "500",
  },
});

export default style;
