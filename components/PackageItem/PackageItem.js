import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { Pressable } from "react-native";

import style from "./PackageItemStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";

const PackageItem = ({ item }) => {
  // Get first image from images array as cover image
  const {
    images: [coverImage],
  } = item;

  const navigation = useNavigation();

  const onPackagePress = useCallback(() => {
    navigation.navigate(Routes.PACKAGE_DETAILS, { packageId: item.id });
  }, [navigation, item.id]);

  return (
    <Pressable
      style={({ pressed }) => ({
        ...style.container,
        ...pressedOpacity(pressed),
      })}
      onPress={onPackagePress}
    >
      <Image
        source={{ uri: baseURL + coverImage.url }}
        style={style.image}
        contentFit="contain"
        transition={100}
      />
    </Pressable>
  );
};

export default memo(PackageItem);
