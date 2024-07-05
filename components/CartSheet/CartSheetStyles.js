import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import { BUTTON_LARGE_HEIGHT } from "../ButtonLarge/ButtonLarge";

const style = StyleSheet.create({
  list: {
    marginHorizontal: 20,
    paddingBottom: BUTTON_LARGE_HEIGHT,
    ...globalStyles.largeContainerGap,
  },
  header: {
    paddingTop: 10,
    padding: 5,
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    paddingVertical: 10,
  },
  headerDates: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  editButton: {
    fontSize: 18,
    fontWeight: "500",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default style;
