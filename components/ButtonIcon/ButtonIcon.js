import * as Haptics from "expo-haptics";
import React, { memo, useCallback } from "react";
import { Platform, Pressable } from "react-native";

import style from "./ButtonIconStyles";
import { Colors } from "../../assets/Colors";
import { pressedBgColor } from "../../assets/styles/globalStyles";

const ButtonIcon = ({
  color = Colors.lightblue,
  pressedColor = Colors.blue,
  onPress,
  containerStyle,
  renderIcon,
  disabled,
}) => {
  const handlePress = useCallback(async () => {
    if (Platform.OS === "ios") {
      await Haptics.selectionAsync();
    }
    onPress && onPress();
  }, [onPress]);

  return (
    // <RectButton
    //   onPress={() => {
    //     Haptics.selectionAsync();
    //     onPress && onPress();
    //   }}
    //   style={style.button({ bgColor: color })}
    //   rippleRadius={100}
    //   rippleColor={pressedColor}
    //   underlayColor={pressedColor}
    //   activeOpacity={0.8}
    // >
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        ...style.button({ bgColor: color, disabled }),
        ...containerStyle,
        ...pressedBgColor(pressed, pressedColor),
      })}
      disabled={disabled}
    >
      {({ pressed }) => renderIcon && renderIcon(pressed)}
    </Pressable>
  );
};

export default memo(ButtonIcon);
