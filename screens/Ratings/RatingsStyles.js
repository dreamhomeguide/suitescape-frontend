import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: Colors.lightgray,
  },
  ratingText: {
    fontSize: 14,
  },
  countText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
  },
});

export default style;
