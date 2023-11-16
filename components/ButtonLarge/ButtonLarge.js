import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text } from "react-native";

import style from "./ButtonLargeStyles";
import {
  disabledOpacity,
  pressedOpacity,
} from "../../assets/styles/globalStyles";

const ButtonLarge = ({
  children,
  onPress,
  disabled,
  half = false,
  ...props
}) => (
  <Pressable
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress && onPress();
    }}
    disabled={disabled}
    {...props}
    style={({ pressed }) => ({
      ...style.button,
      ...(half && style.halfButton),
      ...pressedOpacity(pressed, 0.7),
      ...disabledOpacity(disabled),
    })}
  >
    <Text
      style={{
        ...style.text,
        ...(half && style.halfButtonText),
      }}
    >
      {children}
    </Text>
  </Pressable>
);

export default ButtonLarge;
