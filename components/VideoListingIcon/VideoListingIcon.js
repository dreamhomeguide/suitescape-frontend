import * as Haptics from "expo-haptics";
import React, { memo, useCallback, useMemo } from "react";
import { Platform, Pressable, Text } from "react-native";

import style from "./VideoListingIconStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";

const VideoListingIcon = ({
  IconComponent,
  onPress,
  name,
  label,
  color = "white",
  size = 25,
  hapticEnabled = true,
  renderIcon,
}) => {
  const handlePress = useCallback(() => {
    if (Platform.OS === "ios") {
      hapticEnabled && Haptics.selectionAsync();
    }
    onPress && onPress();
  }, [hapticEnabled, onPress]);

  const renderListingIcon = useMemo(() => {
    if (renderIcon) {
      return renderIcon();
    }

    return (
      <IconComponent
        name={name}
        color={color}
        size={size}
        style={globalStyles.iconShadow}
      />
    );
  }, [renderIcon, name, color, size]);

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          ...style.container,
          ...pressedOpacity(pressed, 0.8),
        })}
      >
        {renderListingIcon}
      </Pressable>
      <Text style={style.text}>{label}</Text>
    </>
  );
};

export default memo(VideoListingIcon);
