import React, { memo } from "react";
import { RadioButton } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";

// Causes bottom sheet to lag
// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

const FormRadio = ({ selected }) => {
  // useLayoutEffect(() => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  // }, [selected]);

  return (
    // <View style={style.border}>
    //   {selected && <View style={style.selected} />}
    // </View>
    <RadioButton selected={selected} color={Colors.blue} size={20} />
  );
};

export default memo(FormRadio);
