import { StyleSheet } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";

const style = StyleSheet.create({
  contentContainer: {
    padding: 20,
    ...globalStyles.largeContainerGap,
  },
});

export default style;
