import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  button: ({ half, bgColor }) => ({
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bgColor,
    ...(half && {
      width: "50%",
    }),
  }),
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default style;
