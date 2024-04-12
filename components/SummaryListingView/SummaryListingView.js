import { Image } from "expo-image";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./SummaryListingViewStyles";
import summaryStyles from "../../assets/styles/summaryStyles";
import { baseURL } from "../../services/SuitescapeAPI";
import CouponBadge from "../CouponBadge/CouponBadge";
import StarRatingView from "../StarRatingView/StarRatingView";

const SummaryListingView = ({ listing, coverImageUrl, discount }) => {
  return (
    <View style={style.mainContainer}>
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
    </View>
  );
};

export default memo(SummaryListingView);
