import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 2,
    left: -10,
  },
  headerLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default style;
