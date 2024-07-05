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
  imagesContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 35,
    rowGap: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  labelCenter: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  coverImageContainer: {
    width: "95%",
    rowGap: 10,
  },
  addCoverImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
  },
  coverImage: {
    height: 200,
    width: "100%",
    backgroundColor: Colors.lightgray,
    borderRadius: 10,
    overflow: "hidden",
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
