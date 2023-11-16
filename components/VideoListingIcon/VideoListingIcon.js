import * as Haptics from "expo-haptics";
import React, { memo } from "react";
import { Pressable } from "react-native";

import style from "./VideoListingIconStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";

const VideoListingIcon = ({
  IconComponent,
  onPress,
  name,
  color = "white",
  size = 30,
  hapticEnabled = true,
}) => {
  return (
    <Pressable
      onPress={() => {
        hapticEnabled && Haptics.selectionAsync();
        onPress && onPress();
      }}
      style={({ pressed }) => ({
        ...style.container,
        ...pressedOpacity(pressed, 0.8),
      })}
    >
      <IconComponent
        name={name}
        color={color}
        size={size}
        style={globalStyles.iconShadow}
      />
    </Pressable>
  );
};

export default memo(VideoListingIcon);
