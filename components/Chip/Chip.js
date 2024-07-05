import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./ChipStyles";
import { Colors } from "../../assets/Colors";

const Chip = ({
  children,
  textStyle,
  color = Colors.red,
  inverted = false,
  renderIcon,
}) => {
  return (
    <View style={style.mainContainer}>
      <View style={style.contentContainer({ inverted, color })}>
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
    </View>
  );
};

export default memo(Chip);
