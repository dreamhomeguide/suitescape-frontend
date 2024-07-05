import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: ({ isActive, width }) => ({
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    padding: 8,
    ...(isActive && {
      backgroundColor: Colors.lightblue,
    }),
    width,
  }),
  contentContainer: (detailsWidth) => ({
    width: detailsWidth,
    marginRight: 10,
  }),
  text: {
    fontWeight: "500",
  },
  image: (imageWidth) => ({
    flex: 1,
    width: imageWidth,
    height: imageWidth * 0.75,
    borderRadius: 10,
  }),
});

export default style;
