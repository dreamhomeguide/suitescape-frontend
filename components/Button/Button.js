import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, Text } from "react-native";

import style from "./ButtonStyles";
import { Colors } from "../../assets/Colors";
import {
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
}) => {
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") {
          Haptics.selectionAsync();
        }
        onPress && onPress();
      }}
      style={({ pressed }) => ({
        ...style.button({ outlined, inverted, color }),
        ...containerStyle,
        ...(inverted
          ? pressedBgColor(pressed, color)
          : pressedOpacity(pressed, outlined ? 0.6 : 0.7)),
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

export default Button;
