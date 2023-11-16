import React, { memo } from "react";
import { Text, View } from "react-native";
import StarRating from "react-native-star-rating-widget";

import style from "./StarRatingViewStyles";

const StarRatingView = ({
  rating,
  starSize = 20,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={{ ...style.ratingContainer, ...containerStyle }}>
      <View style={style.starRatingContainer}>
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
      <Text style={{ ...style.ratingText, ...textStyle }}>{rating}</Text>
    </View>
  );
};

export default memo(StarRatingView);
