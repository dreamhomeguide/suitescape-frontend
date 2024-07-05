import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./DetailsTitleViewStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonLink from "../ButtonLink/ButtonLink";
import Chip from "../Chip/Chip";
import CouponBadge from "../CouponBadge/CouponBadge";
import StarRatingView from "../StarRatingView/StarRatingView";

const DetailsTitleView = ({
  title,
  price,
  rating,
  discount,
  reviewsCount,
  isEntirePlace,
  onSeeAllReviews,
}) => {
  return (
    <View style={style.container}>
      {discount && <CouponBadge>{discount}% Off</CouponBadge>}

      <Text style={style.titleText}>{title ?? "Loading..."}</Text>

      <View style={globalStyles.textGap}>
        {price ? (
          <Text style={style.priceText}>
            ₱{price?.toLocaleString()} per night
          </Text>
        ) : null}

        {/* Ratings */}
        <View style={style.ratingsContainer}>
          {rating ? (
            <StarRatingView rating={rating} textStyle={style.ratingText} />
          ) : null}

          {/* Reviews */}
          {reviewsCount ? (
            <ButtonLink onPress={onSeeAllReviews} textStyle={style.ratingText}>
              {reviewsCount} {reviewsCount === 1 ? "Review" : "Reviews"}
            </ButtonLink>
          ) : null}
        </View>

        {/* Entire Place */}
        {isEntirePlace ? <Chip>Entire Place</Chip> : null}
      </View>
    </View>
  );
};

export default memo(DetailsTitleView);
