import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import style from "./ListingItemStyles";
import globalStyles, { pressedBgColor } from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import StarRatingView from "../StarRatingView/StarRatingView";

const ListingItem = ({ item }) => {
  const {
    images: [coverImage],
    ...listing
  } = item;

  const navigation = useNavigation();

  const onViewListing = useCallback(() => {
    navigation.push(Routes.LISTING_DETAILS, { listingId: listing.id });
  }, [navigation, listing.id]);

  return (
    <Pressable style={globalStyles.flexFull} onPress={onViewListing}>
      {({ pressed }) => (
        <View style={style.mainContainer}>
          <ImageBackground
            source={{ uri: baseURL + coverImage.url }}
            style={globalStyles.coverImage}
            imageStyle={style.imageBorderRadius}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                ...style.imageBorderRadius,
                ...pressedBgColor(pressed, "rgba(0,0,0,0.3)"),
              }}
            />
          </ImageBackground>
          <View style={style.detailsContainer}>
            <Text style={style.detailsName}>{listing.name}</Text>
            <StarRatingView
              rating={listing.average_rating}
              textStyle={style.detailsRatingText}
              starSize={25}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default memo(ListingItem);
