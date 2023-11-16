import React from "react";
import { Text, View } from "react-native";

import style from "./LineViewStyles";

const LineView = ({ children }) => (
  <View style={style.container}>
    <View style={style.line} />
    <View>
      <Text style={style.text}>{children}</Text>
    </View>
    <View style={style.line} />
  </View>
);

export default LineView;
