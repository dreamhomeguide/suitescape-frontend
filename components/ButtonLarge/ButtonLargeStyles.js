import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  button: ({ half }) => ({
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
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
