import React from "react";
import { Pressable, Text } from "react-native";

import style from "./ButtonIconRowStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";

const ButtonIconRow = ({
  label,
  children,
  onPress,
  textStyle,
  gap = 10,
  reverse = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        ...style.button({ gap, reverse }),
        ...pressedOpacity(pressed),
      })}
    >
      <Text style={textStyle}>{label}</Text>
      {children}
    </Pressable>
  );
};

export default ButtonIconRow;
