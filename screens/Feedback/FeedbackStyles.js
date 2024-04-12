import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    rowGap: 15,
  },
  icon: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 25,
  },
  continueContainer: {
    alignItems: "center",
  },
});

export default style;
