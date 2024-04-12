import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./ButtonSocialActionStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";

const ButtonSocialAction = ({ name, label, color, IconComponent, onPress }) => {
  return (
    <View style={style.socialButtonContentContainer}>
      <Pressable
        style={({ pressed }) => ({
          ...style.socialButton,
          ...pressedOpacity(pressed, 0.5),
        })}
        onPress={onPress}
      >
        <IconComponent name={name} size={20} color={color} style={style.icon} />
        <Text style={style.socialButtonText({ textColor: color })}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

export default memo(ButtonSocialAction);
