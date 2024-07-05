import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  swiperContainer: {
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
});

export default style;
