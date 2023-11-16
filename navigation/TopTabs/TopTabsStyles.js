import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  label: {
    fontWeight: "600",
    fontSize: 15,
    textTransform: "capitalize",
  },
  item: {
    width: "auto",
    height: 50,
    paddingHorizontal: 15,
  },
  indicator: {
    backgroundColor: Colors.blue,
  },
});

export default style;
