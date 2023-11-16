import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./VideoListingDetailsStyles";
import ButtonLink from "../ButtonLink/ButtonLink";
import ReadMore from "../ReadMore/ReadMore";
import StarRatingView from "../StarRatingView/StarRatingView";

const VideoListingDetails = ({ listing }) => {
  const { name, average_rating, location, lowest_room_price } = listing;

  return (
    <View style={style.container}>
      <ButtonLink
        textStyle={{
          ...style.text,
          ...style.nameText,
        }}
        numberOfLines={1}
      >
        {name}
      </ButtonLink>
      <Text
        style={{
          ...style.text,
          ...style.priceText,
        }}
      >
        P{lowest_room_price} Per night
      </Text>
      <StarRatingView
        rating={average_rating}
        textStyle={{ ...style.text, ...style.ratingText }}
      />
      <ReadMore
        numberOfLines={1}
        linkStyle={style.readMoreText}
        textStyle={{
          ...style.text,
          ...style.locationText,
        }}
      >
        {location}
      </ReadMore>
    </View>
  );
};

export default memo(VideoListingDetails);
