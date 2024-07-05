import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  fullScreenButton: {
    position: "absolute",
    bottom: 15,
    left: 20,
    borderRadius: 20,
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  transcodingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
  },
});

export default style;
