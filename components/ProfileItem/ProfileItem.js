import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import style from "./ProfileItemStyles";
import globalStyles, { pressedBgColor } from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";

const ProfileItem = ({ item }) => {
  const navigation = useNavigation();

  // Destructure the item object
  const {
    listing: {
      images: [coverImage],
      ...listing
    },
  } = item;

  return (
    <Pressable
      style={globalStyles.flexFull}
      onPress={() =>
        navigation.navigate(Routes.LISTING_DETAILS, { listingId: listing.id })
      }
    >
      {({ pressed }) => (
        <ImageBackground
          source={{ uri: baseURL + coverImage.url }}
          style={style.imageContainer}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              ...pressedBgColor(pressed, "rgba(0,0,0,0.3)"),
            }}
          />
          <Text style={style.text}>{listing.views_count} views</Text>
        </ImageBackground>
      )}
    </Pressable>
  );
};

export default memo(ProfileItem);
