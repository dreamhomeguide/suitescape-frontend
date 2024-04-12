import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: ({ isActive, width }) => ({
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    padding: 8,
    ...(isActive && {
      backgroundColor: Colors.lightgray,
    }),
    width,
  }),
  contentContainer: {
    marginRight: 10,
  },
  text: {
    fontWeight: "500",
  },
  image: (imageSize) => ({
    flex: 1,
    height: imageSize,
    width: imageSize,
    borderRadius: 10,
  }),
});

export default style;
