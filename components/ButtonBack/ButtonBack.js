import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable } from "react-native";

import style from "./ButtonBackStyles";
import Fontello from "../../assets/fontello/Fontello";
import { pressedOpacity } from "../../assets/styles/globalStyles";

const ButtonBack = ({ onPress, color = "black" }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          navigation.goBack();
        }
      }}
      style={({ pressed }) => ({
        ...style.backButton,
        ...pressedOpacity(pressed, 0.6),
      })}
    >
      <Fontello name="chevron-left-regular" size={20} color={color} />
    </Pressable>
  );
};

export default memo(ButtonBack);
