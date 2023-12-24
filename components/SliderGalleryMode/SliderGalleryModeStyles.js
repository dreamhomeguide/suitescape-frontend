import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  text: {
    color: "white",
  },
  indexContainer: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 15,
    right: 15,
  },
  modeContainer: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 13,
    bottom: 15,
    alignSelf: "center",
    flexDirection: "row",
  },
});

export default style;
