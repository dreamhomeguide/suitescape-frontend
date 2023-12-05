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
  linkText: {
    fontSize: 15,
    paddingTop: 1.5,
  },
  ratingsContainer: {
    flexDirection: "row",
    columnGap: 20,
    paddingTop: 1,
  },
});

export default style;
