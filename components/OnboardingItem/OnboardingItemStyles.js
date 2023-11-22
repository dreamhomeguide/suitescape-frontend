import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: ({ width, height }) => ({
    justifyContent: "center",
    width: width - 50,
    height: height / 2 - 85,
  }),
  title: ({ textColor }) => ({
    color: textColor,
    textAlign: "center",
    fontSize: 20,
    margin: 30,
    marginBottom: 35,
  }),
});

export default style;
