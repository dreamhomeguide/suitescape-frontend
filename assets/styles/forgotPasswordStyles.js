import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  mainContainer: {
    padding: 20,
    rowGap: 12,
  },
  contentContainer: {
    marginHorizontal: 5,
    rowGap: 12,
  },
  buttonContainer: {
    marginHorizontal: 5,
    marginTop: 5,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 3,
    marginTop: 15,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  text: {
    fontSize: 16,
  },
  resendText: {
    fontSize: 15,
  },
  timer: {
    fontSize: 14,
    textAlign: "right",
  },
  otpContentContainer: {
    marginHorizontal: 8,
    marginTop: 10,
  },
});

export default style;
