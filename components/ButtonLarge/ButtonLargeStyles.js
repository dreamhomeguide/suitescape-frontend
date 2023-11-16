import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
  },
  halfButton: {
    width: "50%",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  halfButtonText: {
    fontSize: 16,
  },
});

export default style;
