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
    <View style={style.container({ inverted, color })}>
      {renderIcon && renderIcon({ size: 12, color })}
      <Text
        style={{
          ...style.text({ inverted, color }),
          ...textStyle,
        }}
      >
        {children}
      </Text>
    </View>
  );
};

export default memo(Chip);
