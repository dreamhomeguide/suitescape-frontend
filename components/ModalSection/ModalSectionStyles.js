import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: ({ bottomInsets }) => ({
    backgroundColor: "white",
    position: "absolute",
    bottom: bottomInsets < 30 ? 35 : 0,
    left: 0,
    right: 0,
    height: "auto",
    padding: 10,
    rowGap: 10,
  }),
  headerText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  progressText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default style;
