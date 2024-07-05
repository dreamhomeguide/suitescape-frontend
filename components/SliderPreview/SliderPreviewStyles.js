import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  contentContainer: {
    columnGap: 15,
  },
  mediaContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightgray,
    overflow: "hidden",
  },
  media: {
    flex: 1,
    aspectRatio: 1,
  },
  placeholderContainer: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  placeholderText: {
    color: "white",
    fontSize: 18,
  },
});

export default style;
