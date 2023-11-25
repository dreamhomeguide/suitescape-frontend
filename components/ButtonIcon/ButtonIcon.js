import React from "react";
import { Pressable } from "react-native";

import style from "./ButtonIconStyles";
import { Colors } from "../../assets/Colors";
import { pressedBgColor } from "../../assets/styles/globalStyles";

const ButtonIcon = ({
  color = Colors.lightblue,
  pressedColor = Colors.blue,
  renderIcon,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        ...style.button({ bgColor: color }),
        ...pressedBgColor(pressed, pressedColor),
      })}
    >
      {renderIcon && renderIcon()}
    </Pressable>
  );
};

export default ButtonIcon;
