import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";

import style from "./HeaderTextStyles";

const HeaderText = ({ children, textAlign = "center" }) => {
  const { colors } = useTheme();

  return (
    <Text
      style={{
        textAlign,
        color: colors.text,
        ...style.text,
      }}
    >
      {children}
    </Text>
  );
};

export default HeaderText;
