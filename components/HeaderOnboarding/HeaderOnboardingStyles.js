import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    marginTop: 20,
    marginLeft: 15,
  },
  headerRight: {
    marginRight: 22,
    marginTop: 23,
  },
  buttonContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default style;
