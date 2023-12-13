import { StyleSheet } from "react-native";

const MIN_HEIGHT = 700;

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  image: ({ width, height }) => {
    const imageScaleFactor = height < MIN_HEIGHT ? 1.4 : 1;
    const size = (width * 0.85) / imageScaleFactor;

    return {
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "lightgray",
    };
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
