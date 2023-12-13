import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    padding: 20,
    ...globalStyles.largeContainerGap,
  },
  detailsContainer: {
    width: "60%",
    ...globalStyles.containerGap,
  },
  listingName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    columnGap: 30,
    marginTop: 5,
  },
});

export default style;
