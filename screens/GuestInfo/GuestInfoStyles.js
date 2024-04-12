import { StatusBar, StyleSheet } from "react-native";

const style = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 20,
    paddingTop: 15,
    paddingBottom: StatusBar.currentHeight + 5,
  },
  messageContainer: {
    marginTop: 5,
  },
});

export default style;
