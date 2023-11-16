import { StyleSheet } from "react-native";

import detailsStyles from "../../assets/styles/detailsStyles";

const style = StyleSheet.create({
  mainContainer: {
    ...detailsStyles.plainContainer,
    ...detailsStyles.titleContainer,
  },
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
  text: {
    fontSize: 15,
    paddingTop: 1.5,
  },
  ratingsContainer: {
    flexDirection: "row",
    columnGap: 20,
  },
});

export default style;
