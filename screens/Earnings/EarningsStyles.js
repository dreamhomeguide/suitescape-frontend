import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  tooltipContainer: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.lightgray,
    position: "absolute",
    bottom: 5,
    padding: 10,
    overflow: "hidden",
  },
  chartContainer: {
    marginVertical: 15,
  },
});

export default style;
