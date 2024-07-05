import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  imageContainer: ({ topInsets }) => ({
    flex: 1,
    paddingLeft: 20,
    paddingTop: topInsets + 20,
  }),
  footerContentContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
});

export default style;
