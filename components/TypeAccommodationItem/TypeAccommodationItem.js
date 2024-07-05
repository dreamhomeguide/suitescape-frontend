import React, { memo } from "react";
import { Pressable, Text } from "react-native";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import { pressedBgColor } from "../../assets/styles/globalStyles";

const TypeAccommodationItem = ({ item, isSelected, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => ({
        ...style.placeItemContainer,
        borderColor: isSelected ? Colors.blue : Colors.lightgray,
        ...pressedBgColor(pressed),
      })}
      onPress={onPress}
    >
      <Text style={style.labelBold}>{item.label}</Text>
      <Text>{item.description}</Text>
    </Pressable>
  );
};

export default memo(TypeAccommodationItem);
