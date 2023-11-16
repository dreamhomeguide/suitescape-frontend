import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 27,
    marginVertical: 35,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: Colors.gray,
  },
  text: {
    textAlign: "center",
    marginHorizontal: 20,
    color: Colors.gray,
    fontSize: 17,
  },
});

export default style;
