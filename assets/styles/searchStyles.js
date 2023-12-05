import { StyleSheet } from "react-native";

import globalStyles from "./globalStyles";
import { Colors } from "../Colors";

const style = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray,
    paddingVertical: 20,
    ...globalStyles.containerGap,
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
  searchButton: {
    borderRadius: 10,
  },
});

export default style;
