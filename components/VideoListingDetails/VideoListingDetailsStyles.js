import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 2,
    left: 15,
    bottom: 25,
    maxWidth: 200,
  },
  text: {
    color: "white",
    marginBottom: 5,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  locationText: {
    marginTop: 5,
    fontSize: 14,
  },
  priceText: {
    marginTop: 5,
    fontSize: 16,
    color: "gold",
  },
  ratingText: {
    marginBottom: 4,
  },
  readMoreText: {
    color: "rgba(255,255,255,0.5)",
  },
});

export default style;
