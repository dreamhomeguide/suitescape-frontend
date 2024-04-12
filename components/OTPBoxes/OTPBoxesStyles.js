import { StyleSheet } from "react-native";

import { Colors } from "../../assets/Colors";

const style = StyleSheet.create({
  mainContainer: {
    alignSelf: "center",
  },
  contentContainer: {
    columnGap: 14,
    // paddingHorizontal: 5,
  },
  input: ({ hasValue, isFocused, isInvalid }) => {
    let borderColor;

    if (isInvalid) {
      borderColor = Colors.red;
    } else if (isFocused) {
      borderColor = Colors.blue;
    } else if (hasValue) {
      borderColor = "black";
    } else {
      borderColor = "gray";
    }

    return {
      flex: 1,
      height: 50,
      width: 48,
      textAlign: "center",
      borderColor,
      borderWidth: 1,
      borderRadius: 5,
      fontSize: 25,
    };
  },
});

export default style;
