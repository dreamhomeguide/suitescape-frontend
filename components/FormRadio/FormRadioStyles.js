import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 20,
    height: 20,
    width: 20,
  },
  selected: {
    backgroundColor: Colors.blue,
    flex: 1,
    margin: 2,
    borderRadius: 50,
  },
});

export default style;
