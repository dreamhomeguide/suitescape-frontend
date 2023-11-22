import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: ({ topInsets }) => ({
    ...globalStyles.closeModalButton,
    top: topInsets + 15,
  }),
});

export default style;
