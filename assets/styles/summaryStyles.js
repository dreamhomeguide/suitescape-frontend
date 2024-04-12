import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
  },
  link: {
    fontWeight: "500",
    fontSize: 16,
  },
  headerText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 14,
  },
  largeHeaderText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  detailsLabel: {
    flex: 1,
    width: "85%",
    color: "rgba(0,0,0,0.5)",
    fontSize: 15,
  },
  detailsValue: {
    color: "black",
    fontSize: 15,
    textAlign: "right",
  },
  message: {
    textAlign: "left",
  },
  priceDivider: {
    marginHorizontal: 20,
  },
});

export default style;
