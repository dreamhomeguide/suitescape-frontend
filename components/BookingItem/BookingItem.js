import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { memo, useCallback, useMemo } from "react";
import { Text, View } from "react-native";

import style from "./BookingItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
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

  const navigation = useNavigation();

  const onViewDetails = useCallback(() => {
    navigation.navigate(Routes.LISTING_DETAILS, { listingId: listing.id });
  }, [navigation, listing.id]);

  const actionButton = useMemo(
    () => ({
      upcoming: {
        label: "Edit Reservation",
        onPress: () =>
          navigation.navigate(Routes.BOOKING_DETAILS, { bookingId }),
      },
      ongoing: {
        label: "Message",
        onPress: () =>
          navigation.navigate(Routes.CHAT, { id: listing.host.id }),
      },
      completed: {
        label: "Book Again",
        onPress: () => {},
      },
      to_rate: {
        label: "Rate Room",
        onPress: () =>
          navigation.navigate(Routes.RATE_EXPERIENCE, { bookingId }),
      },
    }),
    [],
  );

  return (
    <View style={style.mainContainer}>
      <Image
        source={{
          uri: baseURL + coverImage.url,
        }}
        style={globalStyles.coverImage}
      />
      <View style={globalStyles.containerGap}>
        <View style={style.listingNameContainer}>
          <Text style={style.listingName} numberOfLines={1}>
            {listing.name}
          </Text>
        </View>
        <View style={style.detailsContainer}>
          <Text numberOfLines={1}>{listing.location}</Text>
          <Text numberOfLines={1}>Booking ID: {bookingId}</Text>
          <StarRatingView rating={listing.average_rating} />
        </View>
      </View>

      <View style={globalStyles.horizontalDivider} />

      <View style={{ ...globalStyles.buttonRow, ...style.buttonsContainer }}>
        <Button
          onPress={onViewDetails}
          outlined
          containerStyle={globalStyles.flexFull}
        >
          View Details
        </Button>
        <View style={globalStyles.flexFull}>
          {actionButton[type] && (
            <Button
              onPress={actionButton[type].onPress}
              // containerStyle={globalStyles.flexFull}
            >
              {actionButton[type].label}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(BookingItem);
