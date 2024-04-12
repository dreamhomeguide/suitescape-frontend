import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  indexContainer: ({ bottomInsets }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
    bottom: bottomInsets + 15,
  }),
  closeButton: ({ topInsets }) => ({
    ...globalStyles.closeModalButton,
    top: topInsets + 15,
  }),
  text: {
    color: "white",
  },
});

export default style;
