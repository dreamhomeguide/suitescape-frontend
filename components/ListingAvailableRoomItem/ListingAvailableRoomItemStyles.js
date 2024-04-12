import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    rowGap: 5,
    marginRight: 15,
    marginBottom: 3,
  },
  text: {
    color: "black",
    fontSize: 14,
  },
  tagText: {
    color: Colors.gray,
    fontSize: 14,
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.blue,
  },
  roomNameText: {
    fontSize: 25,
  },
  detailsTitleText: {
    fontSize: 19,
    marginTop: 8,
  },
  priceText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 18,
    marginHorizontal: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    columnGap: 40,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    columnGap: 20,
  },
});

export default style;
