import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  contentContainer: {
    paddingTop: 4,
  },
  titleText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    marginRight: 25,
  },
  priceText: {
    color: "black",
    fontSize: 18,
  },
  ratingText: {
    fontSize: 15,
  },
  ratingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
});

export default style;
