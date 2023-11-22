import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  avatarContainer: ({ fill, size }) => ({
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "gray",
    backgroundColor: fill,
    width: size,
    height: size,
  }),
});

export default style;
