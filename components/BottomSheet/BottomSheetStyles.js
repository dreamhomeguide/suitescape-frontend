import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 12.0,
    elevation: 24,
  },
  handleIndicator: {
    width: 35,
    height: 5,
    backgroundColor: Colors.gray,
  },
});

export default style;
