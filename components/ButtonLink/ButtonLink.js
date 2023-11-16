import React from "react";
import { Pressable, Text } from "react-native";

import style from "./ButtonLinkStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";

const ButtonLink = ({
  children,
  onPress,
  textStyle,
  containerStyle,
  type = "button",
  ...textProps
}) =>
  type === "button" ? (
    <Pressable onPress={onPress} style={containerStyle} hitSlop={10}>
      {({ pressed }) => (
        <Text
          {...textProps}
          style={{
            ...style.link,
            ...textStyle,
            ...pressedOpacity(pressed),
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  ) : type === "text" ? (
    <Text
      {...textProps}
      onPress={onPress}
      style={{ ...style.link, ...textStyle }}
    >
      {children}
    </Text>
  ) : null;

export default ButtonLink;
