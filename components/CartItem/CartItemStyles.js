import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
  },
  subHeader: {
    fontWeight: "500",
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    fontWeight: "500",
    fontSize: 18,
  },
  button: {
    marginTop: 20,
  },
});

export default style;
