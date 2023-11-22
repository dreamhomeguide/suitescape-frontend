import { useTheme } from "@react-navigation/native";
import React from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";

import style from "./OnboardingItemStyles";

const OnboardingItem = ({ title, img }) => {
  // const [assets] = useAssets(img);
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme();

  return (
    <View style={{ width, ...style.container }}>
      <Image
        style={style.image({ width, height })}
        resizeMode="contain"
        // source={assets ? assets[0] : null}
        source={img}
      />
      <Text style={style.title({ textColor: colors.text })}>{title}</Text>
    </View>
  );
};

export default OnboardingItem;
