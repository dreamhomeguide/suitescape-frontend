import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "transparent",
    left: 0,
    right: 0,
    bottom: 0,
  },
  sliderContainer: {
    height: 25,
  },
  largeTrack: {
    height: 6,
  },
  smallTrack: {
    height: 3,
  },
  thumb: {
    height: 15,
    width: 15,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  noThumb: {
    height: 0,
    width: 0,
  },
  trackMark: {
    width: 3,
    height: 6,
    backgroundColor: "white",
  },
  smallTrackMark: {
    height: 3,
  },
});

export default style;
