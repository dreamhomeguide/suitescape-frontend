import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    height: 50,
    width: 40,
    backgroundColor: Colors.red,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    zIndex: 1,
  },
  text: {
    color: "white",
    paddingTop: 10,
    flex: 1,
    fontSize: 12,
    textAlign: "center",
  },
});

export default style;
