import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ImageBackground } from "expo-image";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import style from "./ProfileListingItemStyles";
import globalStyles, { pressedBgColor } from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";

const ProfileListingItem = ({ item, onRemove }) => {
  const navigation = useNavigation();

  // Destructure the item object
  const {
    listing: {
      images: [coverImage],
      ...listing
    },
  } = item;

  const handleRemove = useCallback(() => {
    Haptics.selectionAsync().then(() => {
      onRemove && onRemove(item.listing.id);
    });
  }, [onRemove, item.listing.id]);

  const handlePress = useCallback(() => {
    navigation.navigate(Routes.LISTING_DETAILS, { listingId: listing.id });
  }, [navigation, listing.id]);

  return (
    <Pressable
      style={globalStyles.flexFull}
      onLongPress={handleRemove}
      onPress={handlePress}
    >
      {({ pressed }) => (
        <ImageBackground
          transition={100}
          source={{ uri: baseURL + coverImage.url }}
          style={style.imageContainer}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              ...pressedBgColor(pressed, "rgba(0,0,0,0.3)"),
            }}
          />
          <View style={style.viewsContainer}>
            <Text style={style.viewsText}>{listing.views_count} views</Text>
          </View>
        </ImageBackground>
      )}
    </Pressable>
  );
};

export default memo(ProfileListingItem);
