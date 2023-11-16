import React from "react";
import { View } from "react-native";

import style from "./CheckboxCircleStyles";

const CheckboxCircle = ({ selected }) => {
  return (
    <View style={style.border}>
      {selected && <View style={style.selected} />}
    </View>
  );
};

export default CheckboxCircle;
