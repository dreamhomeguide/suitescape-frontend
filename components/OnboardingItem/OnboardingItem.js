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
        style={{
          ...style.image,
          height: height / 2 - 85,
          width: width - 50,
        }}
        resizeMode="contain"
        // source={assets ? assets[0] : null}
        source={img}
      />
      <Text
        style={{
          color: colors.text,
          ...style.title,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default OnboardingItem;
