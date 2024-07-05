import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: Colors.lightgray,
  },
  contentContainer: {
    rowGap: 3,
    flex: 1,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 120,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  text: {
    fontSize: 14,
  },
  button: {
    padding: 5,
  },
});

export default style;
