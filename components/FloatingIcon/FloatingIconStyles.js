import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  image: (imageSize) => ({
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
  }),
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    right: 10,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 5,
    borderRadius: 10,
  },
});

export default style;
