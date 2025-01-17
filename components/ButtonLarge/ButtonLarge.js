import * as Haptics from "expo-haptics";
import React, { memo, useCallback } from "react";
import { Platform, Pressable, Text } from "react-native";

import style from "./ButtonLargeStyles";
import { Colors } from "../../assets/Colors";
import {
  disabledOpacity,
  pressedOpacity,
} from "../../assets/styles/globalStyles";

export const BUTTON_LARGE_HEIGHT = 100;

const ButtonLarge = ({
  children,
  onPress,
  disabled,
  flexFull = false,
  half = false,
  color = Colors.blue,
  ...props
}) => {
  const handlePress = useCallback(async () => {
    if (Platform.OS === "ios") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress && onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      {...props}
      style={({ pressed }) => ({
        ...style.button({ flexFull, half, bgColor: color }),
        ...pressedOpacity(pressed, 0.7),
        ...disabledOpacity(disabled),
      })}
    >
      <Text style={style.text}>{children}</Text>
    </Pressable>
  );
};

export default memo(ButtonLarge);
