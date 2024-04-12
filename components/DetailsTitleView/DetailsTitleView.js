import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./DetailsTitleViewStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonLink from "../ButtonLink/ButtonLink";
import CouponBadge from "../CouponBadge/CouponBadge";
import StarRatingView from "../StarRatingView/StarRatingView";

const DetailsTitleView = ({
  title,
  price,
  rating,
  reviewsCount,
  discount,
  onSeeAllReviews,
}) => {
  return (
    <View style={style.container}>
      {discount && <CouponBadge>{discount}% Off</CouponBadge>}

      <Text style={style.titleText}>{title ?? "Loading..."}</Text>

      <View style={globalStyles.textGap}>
        {price && (
          <Text style={style.priceText}>
            ₱{price?.toLocaleString()} per night
          </Text>
        )}

        {/* Ratings */}
        <View style={style.ratingsContainer}>
          <StarRatingView rating={rating} textStyle={style.ratingText} />

          {/* Reviews */}
          {reviewsCount ? (
            <ButtonLink onPress={onSeeAllReviews} textStyle={style.ratingText}>
              {reviewsCount} {reviewsCount > 1 ? "Reviews" : "Review"}
            </ButtonLink>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default memo(DetailsTitleView);
