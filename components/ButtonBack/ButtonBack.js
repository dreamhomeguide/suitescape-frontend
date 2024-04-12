import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable, View } from "react-native";

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
    >
      {({ pressed }) => (
        <View
          style={{
            ...style.backButton,
            ...pressedOpacity(pressed, 0.6),
          }}
        >
          <Fontello name="chevron-left-regular" size={20} color={color} />
        </View>
      )}
    </Pressable>
  );
};

export default memo(ButtonBack);
