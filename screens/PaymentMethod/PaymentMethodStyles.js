import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
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
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  paymentMethodIconContainer: {
    width: 50,
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
