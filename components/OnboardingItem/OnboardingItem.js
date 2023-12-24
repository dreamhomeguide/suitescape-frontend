import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

import style from "./OnboardingItemStyles";

const OnboardingItem = ({ title, img }) => {
  // const [assets] = useAssets(img);
  const { colors } = useTheme();

  return (
    <View style={style.container}>
      <Image
        style={style.image}
        contentFit="cover"
        source={img}
        // source={assets ? assets[0] : null}
      />
      <Text style={style.title({ textColor: colors.text })}>{title}</Text>
    </View>
  );
};

export default OnboardingItem;
