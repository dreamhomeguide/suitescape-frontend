import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

import style from "./BookingItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import useFetchAPI from "../../hooks/useFetchAPI";
import { baseURL } from "../../services/SuitescapeAPI";
import Button from "../Button/Button";
import StarRatingView from "../StarRatingView/StarRatingView";

const BookingItem = ({ item, type }) => {
  const { id: bookingId, booking_rooms: bookingRooms } = item;
  const {
    room: {
      listing: { id: listingId, name: listingName, location: listingLocation },
      average_rating: averageRating,
    },
  } = bookingRooms[0];

  const { data: images } = useFetchAPI(`/listings/${listingId}/images`);

  const randomImage = images
    ? images[Math.floor(Math.random() * images.length)]
    : null;

  const actionButton = {
    upcoming: {
      label: "Cancel Booking",
      onPress: () => {},
    },
    completed: {
      label: "Book Again",
      onPress: () => {},
    },
    rating: {
      label: "Rate Room",
      onPress: () => {},
    },
  };

  return (
    <View style={style.mainContainer}>
      <Image
        source={{
          uri: images ? baseURL + randomImage.url : null,
        }}
        style={style.image}
      />
      <View style={style.detailsContainer}>
        <Text style={style.listingName} numberOfLines={1}>
          {listingName}
        </Text>
        <Text numberOfLines={1}>{listingLocation}</Text>
        <Text numberOfLines={1}>Booking ID: {bookingId}</Text>
      </View>
      <StarRatingView rating={averageRating} />
      <View style={globalStyles.horizontalDivider} />
      <View style={style.buttonsContainer}>
        <View style={globalStyles.flexFull}>
          {actionButton[type] && (
            <Button onPress={actionButton[type].onPress}>
              {actionButton[type].label}
            </Button>
          )}
        </View>
        <Button outlined containerStyle={globalStyles.flexFull}>
          View Details
        </Button>
      </View>
    </View>
  );
};

export default BookingItem;
