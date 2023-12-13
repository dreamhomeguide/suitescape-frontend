import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const { width } = Dimensions.get("window");

const ITEM_IMAGE_SIZE = width / 6;

const style = StyleSheet.create({
  mainContainer: ({ isActive }) => ({
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
    borderRadius: 10,
    padding: 5,
    ...(isActive && {
      backgroundColor: Colors.lightgray,
    }),
  }),
  text: {
    fontWeight: "500",
  },
  image: {
    flex: 1,
    height: ITEM_IMAGE_SIZE,
    width: ITEM_IMAGE_SIZE,
    borderRadius: 10,
  },
});

export default style;
