import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    columnGap: 15,
  },
  stepperContainer: (label) => ({
    justifyContent: "flex-end",
    marginTop: label ? "10%" : 4,
    marginBottom: 4,
    marginRight: 4,
  }),
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default style;
