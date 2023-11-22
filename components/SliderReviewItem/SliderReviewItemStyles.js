import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: ({ itemWidth, itemMargin }) => ({
    width: itemWidth,
    marginRight: itemMargin,
    height: 250,
    backgroundColor: Colors.lightgray,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
  }),
  userContainer: {
    paddingTop: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
  avatar: {
    backgroundColor: "transparent",
  },
  userNameContainer: {
    flex: 1,
    marginTop: 5,
    marginLeft: 6,
    marginRight: 16,
  },
  userName: {
    paddingLeft: 3,
    marginBottom: 5,
    fontWeight: "600",
  },
  reviewContainer: {
    flex: 1,
    marginTop: 15,
    marginRight: 10,
  },
});

export default style;
