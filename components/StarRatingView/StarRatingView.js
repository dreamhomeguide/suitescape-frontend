import React, { memo } from "react";
import { Text, View } from "react-native";
import StarRating from "react-native-star-rating-widget";

import style from "./StarRatingViewStyles";

const StarRatingView = ({
  rating,
  starSize = 20,
  labelEnabled = true,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={{ ...style.ratingContainer, ...containerStyle }}>
      <View
        style={{
          left: rating ? -3 : 0,
          ...style.starRatingContainer,
        }}
        pointerEvents="none"
      >
        <StarRating
          rating={rating}
          onChange={() => {}}
          enableSwiping={false}
          enableHalfStar
          starSize={starSize}
          animationConfig={{ scale: 1 }}
          starStyle={style.starRating}
        />
      </View>
      {labelEnabled && (
        <Text style={{ ...style.ratingText, ...textStyle }}>{rating}</Text>
      )}
    </View>
  );
};

export default memo(StarRatingView);
