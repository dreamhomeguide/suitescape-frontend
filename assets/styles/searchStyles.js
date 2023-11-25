import { StyleSheet } from "react-native";

import { Colors } from "../Colors";

const style = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray,
    paddingVertical: 20,
    rowGap: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    marginHorizontal: 20,
  },
  inputContentContainer: {
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
  },
});

export default style;
