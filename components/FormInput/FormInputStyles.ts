import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  field: {
    flexGrow: 1,
    borderRadius: 10,
    padding: 15,
    margin: 5,
  },
  label: {
    marginTop: 10,
    margin: 5,
    color: "gray",
  },
  error: {
    color: Colors.red,
    fontSize: 12,
    left: 15,
    paddingTop: 3,
    paddingBottom: 10,
  },
  trailingIcon: {
    position: "absolute",
    padding: 10,
    borderRadius: 20,
    right: 5,
  },
  trailingLabel: {
    fontSize: 16,
  },
  datePickerContainer: {
    paddingRight: 20,
    paddingBottom: 20,
  },
});

export default style;
