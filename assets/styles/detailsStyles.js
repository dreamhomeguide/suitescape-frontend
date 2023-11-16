import { StyleSheet } from "react-native";

import globalStyles from "./globalStyles";
import { Colors } from "../Colors";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    ...globalStyles.bottomGap,
  },
  plainContainer: {
    backgroundColor: "white",
    ...globalStyles.bottomGap,
  },
  text: {
    color: "black",
    fontSize: 15,
  },
  link: {
    color: Colors.blue,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.blue,
  },
  emphasizedText: {
    color: Colors.red,
    fontSize: 14,
  },
  readMoreText: {
    color: "rgba(0,0,0,0.5)",
  },
  headerText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 15,
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  locationContainer: {
    backgroundColor: Colors.lightgray,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  bottomSeeAllContainer: {
    marginBottom: 18,
    alignItems: "center",
  },
  rightSeeAllContainer: {
    marginBottom: 14,
    marginTop: 3,
  },
  serviceRatingContainer: {
    paddingVertical: 3,
  },
  reportContainer: {
    borderBottomWidth: 0,
  },
});

export default style;
