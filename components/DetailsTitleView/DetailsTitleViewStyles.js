import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  titleText: {
    flex: 1,
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    marginRight: 20,
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
