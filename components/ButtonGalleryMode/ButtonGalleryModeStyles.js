import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  text: {
    color: "white",
  },
  button: ({ isActive }) => ({
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 13,
    ...(isActive ? { backgroundColor: "rgba(0,0,0,0.5)" } : { opacity: 0.6 }),
  }),
});

export default style;
