import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./LogoTextStyles";

const LogoText = () => {
  const { colors } = useTheme();

  return (
    <View style={style.container}>
      <Text
        style={{
          color: colors.text,
          ...style.logoText,
          ...style.bold,
        }}
      >
        Suitescape
      </Text>
      <Text
        style={{
          color: colors.text,
          ...style.logoText,
        }}
      >
        PH
      </Text>
    </View>
  );
};

export default memo(LogoText);
