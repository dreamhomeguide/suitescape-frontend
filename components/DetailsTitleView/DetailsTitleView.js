import React from "react";
import { Text, View } from "react-native";

import style from "./DetailsTitleViewStyles";
import detailsStyles from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonLink from "../ButtonLink/ButtonLink";
import CouponBadge from "../CouponBadge/CouponBadge";
import StarRatingView from "../StarRatingView/StarRatingView";

const DetailsTitleView = ({ title, price, rating, reviewsCount, discount }) => {
  return (
    <View
      style={{
        ...detailsStyles.plainContainer,
        ...detailsStyles.titleContainer,
      }}
    >
      {discount && <CouponBadge>{discount}% Off</CouponBadge>}

      <View style={style.contentContainer}>
        <Text style={style.titleText}>{title ?? "Loading..."}</Text>

        <View style={globalStyles.textGap}>
          {price && <Text style={style.priceText}>₱{price} per night</Text>}

          {/* Ratings */}
          <View style={style.ratingsContainer}>
            <StarRatingView rating={rating} textStyle={style.ratingText} />

            {/* Reviews */}
            <View>
              {reviewsCount ? (
                <ButtonLink textStyle={style.linkText}>
                  {reviewsCount} {reviewsCount > 1 ? "Reviews" : "Review"}
                </ButtonLink>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DetailsTitleView;
