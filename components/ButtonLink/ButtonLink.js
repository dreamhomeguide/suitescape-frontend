import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

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
    // Prevents from taking the whole width
    <View
      style={{ ...style.button, ...containerStyle }}
      pointerEvents="box-none"
    >
      <Pressable onPress={onPress} hitSlop={10}>
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
    </View>
  ) : type === "text" ? (
    <Text
      {...textProps}
      onPress={onPress}
      style={{ ...style.link, ...textStyle }}
    >
      {children}
    </Text>
  ) : null;

export default memo(ButtonLink);
