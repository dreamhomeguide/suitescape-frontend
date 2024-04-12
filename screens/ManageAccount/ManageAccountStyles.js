import { StatusBar, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 15,
    paddingBottom: StatusBar.currentHeight + 5,
  },
  contentContainer: {
    rowGap: 5,
  },
  profileImageContainer: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 25,
  },
  addButtonContainer: {
    position: "absolute",
    height: 30,
    width: 30,
    borderRadius: 50,
    bottom: 0,
    right: 10,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    alignSelf: "center",
    left: 1,
  },
});

export default style;
