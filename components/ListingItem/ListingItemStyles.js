import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: "white",
  },
  detailsContainer: {
    paddingTop: 15,
    paddingHorizontal: 5,
    paddingBottom: 10,
    ...globalStyles.textGap,
  },
  detailsName: {
    fontSize: 18,
    fontWeight: "500",
  },
  detailsRatingText: {
    fontSize: 14,
  },
  imageBorderRadius: {
    borderRadius: 10,
  },
});

export default style;
