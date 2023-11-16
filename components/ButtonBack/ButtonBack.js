import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, View } from "react-native";

import style from "./ButtonBackStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";

const ButtonBack = ({ onPress, color = "black" }) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View
        style={{
          ...style.backButton,
          ...pressedOpacity(pressed, 0.7),
        }}
      >
        <Ionicons name="chevron-back" size={30} color={color} />
      </View>
    )}
  </Pressable>
);

export default ButtonBack;
