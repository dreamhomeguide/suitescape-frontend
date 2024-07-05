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
  inputContentContainer: {
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  searchHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
  filterContainer: {
    marginHorizontal: 20,
  },
  searchContainer: {
    paddingRight: 25,
    paddingLeft: 20,
    rowGap: 10,
  },
  iconContainer: {
    backgroundColor: Colors.lightgray,
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  searchInputContainer: {
    padding: 20,
  },
  searchItemContentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  searchItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
    marginHorizontal: 5,
  },
  recentItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  recentItemContentContainer: {
    flex: 1,
  },
});

export default style;
