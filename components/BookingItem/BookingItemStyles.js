import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

const { height } = Dimensions.get("window");

const style = StyleSheet.create({
  mainContainer: {
    padding: 20,
    ...globalStyles.largeContainerGap,
  },
  detailsContainer: {
    width: "60%",
    ...globalStyles.containerGap,
  },
  image: {
    height: height / 4,
    width: "100%",
    backgroundColor: Colors.lightgray,
    borderRadius: 10,
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
