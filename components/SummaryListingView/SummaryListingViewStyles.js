import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 15,
    paddingTop: 4,
  },
  titleContentContainer: {
    flex: 1.8,
    rowGap: 3,
    paddingVertical: 20,
  },
  image: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.lightgray,
  },
});

export default style;
