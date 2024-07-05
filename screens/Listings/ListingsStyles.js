import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "500",
    fontSize: 22,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    columnGap: 20,
  },
  searchField: {
    backgroundColor: Colors.lightgray,
  },
  searchContainer: {
    paddingTop: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    rowGap: 20,
  },
});

export default style;
