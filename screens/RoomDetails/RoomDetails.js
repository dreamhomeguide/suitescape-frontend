import { useQuery } from "@tanstack/react-query";
import { isWithinInterval } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import style from "./RoomDetailsStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppFooterDetails from "../../components/AppFooterDetails/AppFooterDetails";
import DetailsDescriptionView from "../../components/DetailsDescriptionView/DetailsDescriptionView";
import DetailsFeaturesView from "../../components/DetailsFeaturesView/DetailsFeaturesView";
import DetailsObjectView from "../../components/DetailsObjectView/DetailsObjectView";
import DetailsTitleView from "../../components/DetailsTitleView/DetailsTitleView";
import { FEATURES } from "../../components/ListingFeaturesView/ListingFeaturesView";
import Stepper from "../../components/Stepper/Stepper";
import {
  useBookingContext,
  useBookingData,
} from "../../contexts/BookingContext";
import { useCartContext, useCartData } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { useTimerContext } from "../../contexts/TimerContext";
import { Routes } from "../../navigation/Routes";
import { fetchRoom } from "../../services/apiService";
import formatRange from "../../utils/rangeFormatter";

const AMENITIES_IN_VIEW = 6;

const RoomDetails = ({ navigation, route }) => {
  const roomId = route.params.roomId;

  const [showScreen, setShowScreen] = useState(false);

  const { addItem, removeItem, updateQuantity } = useCartContext();
  const { startTimer } = useTimerContext();
  const { listing } = useListingContext();
  const { setRoom } = useRoomContext();
  const { setBookingData } = useBookingContext();
  const bookingData = useBookingData();
  const cartData = useCartData();

  const { data: roomData } = useQuery({
    queryKey: [
      "listings",
      listing.id,
      "rooms",
      roomId,
      bookingData.startDate,
      bookingData.endDate,
    ],
    queryFn: () =>
      fetchRoom({
        roomId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      }),
  });

  // Set room to global context
  useEffect(() => {
    setRoom(roomData);
  }, [roomData]);

  // Clear global room on unmount
  useEffect(() => {
    return () => {
      setRoom(null);
    };
  }, []);

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      setBookingData({
        listingId: listing.id,
        highlightedDates: [bookingData.startDate, bookingData.endDate],
      });
    }
  }, [bookingData.startDate, bookingData.endDate, listing.id]);

  const cartRoom = useMemo(() => {
    return cartData.cart.find((item) => item.id === roomId);
  }, [cartData.cart, roomId]);

  const isAvailable = useMemo(() => {
    // Check if room has stock
    const hasQuantity = roomData?.category.quantity > 0;

    // Check if room is available today
    const isAvailableToday = roomData?.unavailable_dates.every(
      (unavailableDate) =>
        !isWithinInterval(unavailableDate.date, {
          start: bookingData.startDate,
          end: bookingData.endDate,
        }),
    );

    return hasQuantity && isAvailableToday;
  }, [
    bookingData.startDate,
    bookingData.endDate,
    roomData?.category.quantity,
    roomData?.unavailable_dates,
  ]);

  const footerLinkOnPress = useCallback(() => {
    navigation.navigate({
      name: Routes.SELECT_DATES,
      merge: true,
    });
  }, [navigation]);

  const handleAddToCart = useCallback(() => {
    if (!roomData || !listing) {
      return;
    }

    if (cartRoom) {
      removeItem({ listingId: listing.id, roomId });
      return;
    }

    addItem({
      listingData: {
        id: listing.id,
        name: listing.name,
        image: listing.images[0].url,
      },
      roomData: {
        id: roomId,
        name: roomData.category.name,
        price: roomData.category.price,
        maxQuantity: roomData.category.quantity,
      },
    });
    startTimer(listing.id);
  }, [
    cartRoom,
    listing?.id,
    listing?.name,
    roomId,
    roomData?.category.name,
    roomData?.category.price,
  ]);

  const onStepperChange = useCallback(
    (value) =>
      updateQuantity({
        listingId: listing.id,
        roomId,
        newQuantity: value,
      }),
    [listing.id, roomId],
  );

  const footerTitle = useMemo(() => {
    if (!roomData?.category.price) {
      return "";
    }
    return `₱${roomData.category.price?.toLocaleString()}/night`;
  }, [roomData?.category.price]);

  const footerLinkLabel = useMemo(() => {
    if (!bookingData.startDate && !bookingData.endDate) {
      return "Select Date";
    }

    return formatRange(bookingData.startDate, bookingData.endDate);
  }, [bookingData.startDate, bookingData.endDate]);

  if (!showScreen) {
    return (
      <ActivityIndicator
        size="small"
        style={globalStyles.loadingCircle}
        onLayout={() => setShowScreen(true)}
      />
    );
  }

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView contentContainerStyle={globalStyles.rowGap}>
        <DetailsTitleView
          title={roomData?.category.name}
          price={roomData?.category.price}
        />

        {/* Room Size */}
        <DetailsDescriptionView
          title="Room Size"
          description={`${roomData?.category.floor_area} sqm`}
          emptyText="No room size."
        />

        {/* Available beds */}
        <DetailsObjectView
          title="Available beds"
          object={roomData?.category.type_of_beds}
        />

        {/* Description */}
        <DetailsDescriptionView
          title="Room Description"
          description={roomData?.category.description}
        />

        {/* Rules */}
        <DetailsDescriptionView
          title="Room Rules"
          description={roomData?.rule.content}
          emptyText="No room rules."
        />

        {/* Amenities */}
        <DetailsFeaturesView
          feature={FEATURES.amenities}
          data={roomData?.amenities}
          size={AMENITIES_IN_VIEW}
        />
      </ScrollView>

      <AppFooter>
        {cartRoom && (
          <View style={style.quantityContainer}>
            <Stepper
              value={cartRoom.quantity}
              minValue={1}
              maxValue={cartRoom.maxQuantity}
              onValueChange={onStepperChange}
              containerStyle={style.quantityContentContainer}
            />
          </View>
        )}

        <AppFooterDetails
          title={footerTitle}
          buttonLinkLabel={footerLinkLabel}
          buttonLinkOnPress={footerLinkOnPress}
          buttonLabel={cartRoom ? "Remove from Cart" : "Add to Cart"}
          buttonProps={{
            color: cartRoom ? Colors.red : Colors.blue,
            disabled: !isAvailable,
          }}
          buttonOnPress={handleAddToCart}
        />
      </AppFooter>
    </View>
  );
};

export default RoomDetails;
