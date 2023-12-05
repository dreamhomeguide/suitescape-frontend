import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: ({ width }) => {
    const size = width * 0.85;
    return {
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: "lightgray",
    };
  },
  title: ({ textColor }) => ({
    color: textColor,
    textAlign: "center",
    fontSize: 20,
    margin: 30,
    marginBottom: 35,
  }),
});

export default style;
