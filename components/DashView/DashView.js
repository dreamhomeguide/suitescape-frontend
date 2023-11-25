import React from "react";
import { Text, View } from "react-native";

import style from "./DashViewStyles";

const DashView = () => {
  return (
    <View style={style.container}>
      <Text style={style.dash}>-</Text>
    </View>
  );
};

export default DashView;
