import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./VideoListingDetailsStyles";
import { Routes } from "../../navigation/Routes";
import ButtonLink from "../ButtonLink/ButtonLink";
import Chip from "../Chip/Chip";
import ReadMore from "../ReadMore/ReadMore";
import StarRatingView from "../StarRatingView/StarRatingView";

const VideoListingDetails = ({ listing }) => {
  const {
    id: listingId,
    name,
    average_rating,
    location,
    lowest_room_price,
    is_entire_place,
    entire_place_price,
  } = listing;

  const navigation = useNavigation();

  const price = is_entire_place ? entire_place_price : lowest_room_price;

  return (
    <View style={style.container}>
      <ButtonLink
        textStyle={{
          ...style.text,
          ...style.nameText,
        }}
        numberOfLines={1}
        onPress={() =>
          navigation.navigate(Routes.LISTING_DETAILS, { listingId })
        }
      >
        {name}
      </ButtonLink>
      {is_entire_place ? <Chip>Entire Place</Chip> : null}
      <Text
        style={{
          ...style.text,
          ...style.priceText,
        }}
      >
        P{price?.toLocaleString()} Per night
      </Text>
      <StarRatingView rating={average_rating} textStyle={style.text} />
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
