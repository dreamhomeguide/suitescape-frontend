import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    ...globalStyles.bottomGap,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 15,
    paddingTop: 4,
  },
  titleContentContainer: {
    flex: 1.8,
    ...globalStyles.textGap,
  },
  image: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.lightgray,
  },
  largeHeaderText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  headerText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 14,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  detailsLabel: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 15,
  },
  detailsValue: {
    flex: 1,
    color: "black",
    fontSize: 15,
    textAlign: "right",
  },
  message: {
    textAlign: "left",
  },
});

export default style;
