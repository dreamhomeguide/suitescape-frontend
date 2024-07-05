import { StyleSheet } from "react-native";

import { BUTTON_LARGE_HEIGHT } from "../../components/ButtonLarge/ButtonLarge";
import { Colors } from "../Colors";

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    rowGap: 20,
    padding: 25,
  },
  viewContainer: {
    backgroundColor: "white",
    padding: 20,
  },
  itemContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    rowGap: 15,
  },
  listItemContainer: {
    flex: 1,
    padding: 20,
    columnGap: 20,
    backgroundColor: Colors.lightgray,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemContentContainer: {
    flex: 1,
    rowGap: 10,
  },
  listItemTitle: {
    fontSize: 22,
    fontWeight: "500",
  },
  listItemLabel: {
    color: Colors.gray,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  labelBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hint: {
    flex: 1,
    color: Colors.gray,
  },
  hintContainer: {
    marginBottom: 8,
  },
  contentContainer: {
    rowGap: 20,
    padding: 25,
  },
  featuresViewContainer: {
    padding: 15,
  },
  sheetContainer: {
    paddingBottom: BUTTON_LARGE_HEIGHT,
    paddingHorizontal: 15,
  },
  mediaContainer: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    borderRadius: 10,
    overflow: "hidden",
  },
  columnWrapper: {
    columnGap: 20,
  },
  progress: {
    borderRadius: 0,
  },
  checkbox: {
    pointerEvents: "none",
  },
  media: {
    aspectRatio: 4 / 3,
  },
  videoPreview: {
    backgroundColor: "black",
    aspectRatio: 4 / 3,
  },
  video: {
    aspectRatio: 9 / 16,
  },
  loadingCircle: {
    margin: 20,
  },
});

const createListingStyles = StyleSheet.create({
  facilityItemContainer: {
    ...style.itemContainer,
    alignItems: "center",
  },
  placeItemContainer: {
    ...style.itemContainer,
    rowGap: 10,
  },
  gapSheetContainer: {
    ...style.sheetContainer,
    rowGap: 20,
  },
  ...style,
});

export default createListingStyles;
