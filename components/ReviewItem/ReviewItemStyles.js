import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    padding: 15,
    // paddingBottom: 20,
    backgroundColor: "white",
    ...globalStyles.bottomGap,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    marginBottom: 10,
  },
  userNameContainer: {
    marginTop: 4,
  },
  userName: {
    fontSize: 15,
  },
  listingButtonContainer: {
    flexDirection: "row",
    backgroundColor: Colors.lightgray,
    marginBottom: 15,
  },
  listingImage: {
    height: 70,
    width: 80,
    backgroundColor: "lightgray",
  },
  listingDetailsContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 15,
    rowGap: 1,
  },
  listingName: {
    fontSize: 15,
    fontWeight: "500",
  },
  listingCategory: {
    fontSize: 13,
  },
  contentContainer: {
    rowGap: 5,
  },
  timestamp: {
    color: Colors.gray,
    fontSize: 12,
  },
});

export default style;
