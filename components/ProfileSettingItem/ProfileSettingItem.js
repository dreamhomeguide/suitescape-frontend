import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import style from "./ProfileSettingItemStyles";
import { Colors } from "../../assets/Colors";

const ProfileSettingItem = ({ title, onPress }) => {
  const { colors } = useTheme();

  return (
    <RectButton
      // style={{
      //   ...pressedBgColor(pressed, colors.border),
      //   ...(pressed && style.settingsValuePressed),
      // })}
      onPress={onPress}
    >
      <View
        style={{
          ...style.settingsValueContainer,
          borderColor: colors.border,
        }}
      >
        <Text style={{ color: colors.text }}>{title}</Text>
        <Ionicons name="chevron-forward" size={21} color={Colors.blue} />
      </View>
    </RectButton>
  );
};

export default memo(ProfileSettingItem);
