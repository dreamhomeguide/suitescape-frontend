import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: "28%",
    height: 105,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
    marginHorizontal: 10,
    marginBottom: 14,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: Colors.lightgray,
  },
  text: {
    color: "black",
    textAlign: "center",
  },
});

export default style;
