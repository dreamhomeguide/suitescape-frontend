import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  field: {
    flexGrow: 1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  label: {
    marginTop: 10,
    marginVertical: 5,
    color: "gray",
  },
  error: {
    flex: 1,
    color: Colors.red,
    fontSize: 12,
    left: 15,
    marginTop: 3,
    marginBottom: 10,
    marginRight: 20,
  },
  leadingIcon: {
    width: "10%",
    bottom: 1,
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
