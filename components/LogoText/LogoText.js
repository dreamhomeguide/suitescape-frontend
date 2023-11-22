import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./LogoTextStyles";

const LogoText = () => {
  const { colors } = useTheme();

  return (
    <View style={style.container}>
      <Text style={style.logoText({ textColor: colors.text, bold: true })}>
        Suitescape
      </Text>
      <Text style={style.logoText({ textColor: colors.text })}>PH</Text>
    </View>
  );
};

export default memo(LogoText);
