import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 25,
  },
  input: ({ hasValue }) => ({
    height: 50,
    width: 50,
    textAlign: "center",
    borderColor: hasValue ? "black" : "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 14,
    fontSize: 25,
  }),
});

export default style;
