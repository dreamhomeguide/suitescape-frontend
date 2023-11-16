import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
const { width } = Dimensions.get("window");

const style = StyleSheet.create({
  mainContainer: {
    height: 50,
    marginHorizontal: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: width / 2 + 30,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    width: 40,
    marginRight: 15,
  },
  text: {
    color: Colors.gray,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default style;
