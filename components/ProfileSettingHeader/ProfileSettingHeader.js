import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./ProfileSettingHeaderStyles";

const ProfileSettingHeader = ({ title }) => {
  const { colors } = useTheme();

  return (
    <View style={style.settingsKeyContainer}>
      <Text style={{ ...style.settingsKey, color: colors.text }}>{title}</Text>
    </View>
  );
};

export default memo(ProfileSettingHeader);
