import React, { memo, useLayoutEffect } from "react";
import { View, LayoutAnimation, Platform, UIManager } from "react-native";

import style from "./FormRadioStyles";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FormRadio = ({ selected }) => {
  useLayoutEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [selected]);

  return (
    <View style={style.border}>
      {selected && <View style={style.selected} />}
    </View>
  );
};

export default memo(FormRadio);
