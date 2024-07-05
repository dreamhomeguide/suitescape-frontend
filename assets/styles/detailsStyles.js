import { StyleSheet } from "react-native";

import { Colors } from "../Colors";

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
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
    color: Colors.lightred,
    fontSize: 14,
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
    overflow: "hidden",
  },
  locationButtonContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
    padding: 5,
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
  // reportContainer: {
  //   borderBottomWidth: 0,
  // },
});

export default style;
