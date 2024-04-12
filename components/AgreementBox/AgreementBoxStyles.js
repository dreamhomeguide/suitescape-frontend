import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  textContainer: ({ textColor }) => ({
    flex: 1,
    color: textColor,
  }),
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  checkbox: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderColor: "gray",
  },
});

export default style;
