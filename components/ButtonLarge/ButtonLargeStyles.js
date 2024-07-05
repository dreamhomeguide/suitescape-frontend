import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  button: ({ flexFull, half, bgColor }) => ({
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: bgColor,
    ...(half && {
      width: "50%",
    }),
    ...(flexFull && {
      flex: 1,
    }),
  }),
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default style;
