import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: ({ topInsets }) => ({
    flex: 1,
    paddingLeft: 20,
    paddingTop: topInsets + 20,
  }),
  contentContainer: {
    paddingLeft: 10,
    paddingTop: 35,
    rowGap: 5,
  },
  headerText: {
    fontSize: 30,
    color: "white",
    fontWeight: "600",
  },
  subHeaderText: {
    fontSize: 20,
    color: "white",
    fontWeight: "500",
  },
  footer: {
    bottom: 20,
  },
});

export default style;
