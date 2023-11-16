import { Platform, StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    position: "absolute",
    bottom: Platform.OS === "android" ? 35 : 0,
    left: 0,
    right: 0,
    height: 150,
  },
  scrollViewContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 15,
  },
  headerText: {
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default style;
