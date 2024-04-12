import * as Haptics from "expo-haptics";
import React, { memo, useCallback } from "react";
import { Platform, Pressable, Text } from "react-native";

import style from "./ButtonStyles";
import { Colors } from "../../assets/Colors";
import {
  disabledOpacity,
  pressedBgColor,
  pressedOpacity,
} from "../../assets/styles/globalStyles";

const Button = ({
  children,
  color = Colors.blue,
  onPress,
  containerStyle,
  textStyle,
  outlined = false,
  inverted = false,
  disabled = false,
}) => {
  const handlePress = useCallback(async () => {
    if (Platform.OS === "ios") {
      await Haptics.selectionAsync();
    }
    onPress && onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        ...style.button({ outlined, inverted, color }),
        ...containerStyle,
        ...(inverted
          ? pressedBgColor(pressed, color)
          : pressedOpacity(pressed, outlined ? 0.6 : 0.7)),
        ...disabledOpacity(disabled),
      })}
    >
      {({ pressed }) => (
        <Text
          style={{
            ...style.text({ outlined, inverted, color }),
            ...textStyle,
            ...(pressed && !outlined && { color: "white" }),
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default memo(Button);
