import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    padding: 20,
    ...globalStyles.largeContainerGap,
  },
  listingName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listingNameContainer: {
    width: "70%",
    ...globalStyles.containerGap,
  },
  detailsContainer: {
    width: "60%",
    ...globalStyles.containerGap,
  },
  buttonsContainer: {
    marginTop: 5,
  },
});

export default style;
