import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./SummaryListingViewStyles";
import summaryStyles from "../../assets/styles/summaryStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import CouponBadge from "../CouponBadge/CouponBadge";
import StarRatingView from "../StarRatingView/StarRatingView";

const SummaryListingView = ({ listing, coverImageUrl, discount }) => {
  const navigation = useNavigation();

  const onListingPress = useCallback(
    () =>
      navigation.navigate(Routes.LISTING_DETAILS, { listingId: listing.id }),
    [listing?.id],
  );

  return (
    <Pressable onPress={onListingPress} style={style.mainContainer}>
      <View style={style.titleContainer}>
        {coverImageUrl && (
          <Image
            source={{ uri: baseURL + coverImageUrl }}
            style={style.image}
          />
        )}

        <View style={style.titleContentContainer}>
          <Text style={summaryStyles.largeHeaderText}>{listing?.name}</Text>
          <StarRatingView rating={listing?.average_rating} />
        </View>
      </View>

      {discount && <CouponBadge>{discount}% Off</CouponBadge>}
    </Pressable>
  );
};

export default memo(SummaryListingView);
