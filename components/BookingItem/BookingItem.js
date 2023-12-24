import { Image } from "expo-image";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./BookingItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { baseURL } from "../../services/SuitescapeAPI";
import Button from "../Button/Button";
import StarRatingView from "../StarRatingView/StarRatingView";

const BookingItem = ({ item, type }) => {
  const { id: bookingId, booking_rooms: bookingRooms } = item;

  // Get the first room only on the booking
  const {
    room: {
      listing: {
        images: [coverImage],
        ...listing
      },
    },
  } = bookingRooms[0] || {};

  // Get first image
  // const { data: images } = useFetchAPI(`/listings/${listingId}/images`);
  // const coverImage = images ? images[0] : null;

  // Get random image
  // const coverImage = useMemo(
  //   () => (images ? images[Math.floor(Math.random() * images.length)] : null),
  //   [images],
  // );

  const actionButton = {
    upcoming: {
      label: "Cancel Booking",
      onPress: () => {},
    },
    completed: {
      label: "Book Again",
      onPress: () => {},
    },
    to_rate: {
      label: "Rate Room",
      onPress: () => {},
    },
  };

  return (
    <View style={style.mainContainer}>
      <Image
        source={{
          uri: baseURL + coverImage.url,
        }}
        style={globalStyles.coverImage}
      />
      <View style={style.detailsContainer}>
        <Text style={style.listingName} numberOfLines={1}>
          {listing.name}
        </Text>
        <Text numberOfLines={1}>{listing.location}</Text>
        <Text numberOfLines={1}>Booking ID: {bookingId}</Text>
        <StarRatingView rating={listing.average_rating} />
      </View>
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

export default memo(BookingItem);
