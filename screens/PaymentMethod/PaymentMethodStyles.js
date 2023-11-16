import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 20,
  },
  contentContainer: {
    marginVertical: 10,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  paymentMethodContentContainer: {
    flexDirection: "row",
    flex: 2,
    columnGap: 15,
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 16,
  },
  checkboxContainer: {
    paddingRight: 5,
  },
});

export default style;
