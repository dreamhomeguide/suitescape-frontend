import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

const { width } = Dimensions.get("window");

const IMAGE_SIZE = width * 0.48;

const style = StyleSheet.create({
  imageContainer: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE + globalStyles.uniformGap.gap,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: Colors.lightgray,
    padding: 8,
  },
  viewsContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  viewsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default style;
