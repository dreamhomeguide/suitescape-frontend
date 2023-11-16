import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./ChipStyles";
import { Colors } from "../../assets/Colors";

const Chip = ({
  children,
  textStyle,
  color = Colors.blue,
  inverted = false,
  renderIcon,
}) => {
  return (
    <View
      style={{
        backgroundColor: color,
        ...style.container,
        ...(inverted && {
          backgroundColor: "transparent",
          borderColor: color,
          borderWidth: 1,
        }),
      }}
    >
      {renderIcon && renderIcon({ size: 12, color })}
      <Text
        style={{
          ...style.text,
          ...(inverted && { color }),
          ...textStyle,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

export default memo(Chip);
