import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const { width, height } = Dimensions.get("window");

const MIN_HEIGHT = 700;

// const containerMargin = height < MIN_HEIGHT ? 25 : 35;
const imageScaleFactor = height < MIN_HEIGHT ? 1.4 : 1;
const imageSize = (width * 0.85) / imageScaleFactor;

const style = StyleSheet.create({
  container: {
    width,
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: containerMargin,
  },
  image: {
    justifyContent: "center",
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    backgroundColor: Colors.lightgray,
  },
  title: ({ textColor }) => ({
    color: textColor,
    fontWeight: "500",
    textAlign: "center",
    fontSize: 20,
    marginTop: 30,
    marginHorizontal: 30,
  }),
});

export default style;
