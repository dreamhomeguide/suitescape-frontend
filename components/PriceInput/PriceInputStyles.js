import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    // paddingRight: 15,
    maxWidth: "80%",
  },
  iconContainer: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: Colors.lightgray,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
});

export default style;
