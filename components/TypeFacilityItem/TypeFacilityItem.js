import React, { memo } from "react";
import { Pressable, Text } from "react-native";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import { pressedBgColor } from "../../assets/styles/globalStyles";

const TypeFacilityItem = ({ item, isSelected, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => ({
        ...style.facilityItemContainer,
        borderColor: isSelected ? Colors.blue : Colors.lightgray,
        ...pressedBgColor(pressed),
      })}
      onPress={onPress}
    >
      {item.icon}
      <Text style={style.label}>{item.label}</Text>
    </Pressable>
  );
};

export default memo(TypeFacilityItem);
