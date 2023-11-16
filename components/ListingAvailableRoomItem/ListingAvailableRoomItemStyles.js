import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 20,
    ...globalStyles.bottomGap,
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
    marginBottom: 5,
  },
  text: {
    color: "black",
    fontSize: 14,
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.blue,
  },
  roomNameText: {
    fontSize: 25,
    marginBottom: 10,
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
    marginBottom: 12,
    marginTop: 15,
  },
  detailsContainer: {
    flexDirection: "row",
    columnGap: 40,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    columnGap: 20,
  },
});

export default style;
