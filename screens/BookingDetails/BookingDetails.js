import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DetailsPolicyView from "../../components/DetailsPolicyView/DetailsPolicyView";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import SummaryFooter from "../../components/SummaryFooter/SummaryFooter";
import SummaryListView from "../../components/SummaryListView/SummaryListView";
import SummaryListingView from "../../components/SummaryListingView/SummaryListingView";
import SummaryLocationView from "../../components/SummaryLocationView/SummaryLocationView";
import { useListingContext } from "../../contexts/ListingContext";
import { Routes } from "../../navigation/Routes";
import {
  fetchProfile,
  fetchConstant,
  fetchBooking,
} from "../../services/apiService";
import {
  getAddOnDetails,
  getBookingDetails,
  getGuestDetails,
  getOriginalPrice,
  getPaymentDetails,
  getRoomDetails,
} from "../../utils/getBookingDetails";
import selectBookingData from "../../utils/selectBookingData";

const DISCOUNT = 0.1; // 10% discount

const BookingDetails = ({ navigation, route }) => {
  const bookingId = route.params.bookingId;

  const { setListing } = useListingContext();

  const { data: booking, isFetching: isFetchingBooking } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId),
    select: selectBookingData,
  });

  // Set listing to global context on focus
  useFocusEffect(
    useCallback(() => {
      if (booking?.listing) {
        setListing(booking.listing);
      }
    }, [booking?.listing]),
  );

  // Clear global listing and dates on unmount
  useEffect(() => {
    return () => {
      setListing(null);
    };
  }, []);

  const { data: userData, isFetching: isFetchingUser } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const { data: suitescapeFee, isFetching: isFetchingFee } = useQuery({
    queryKey: ["fees", "suitescape"],
    queryFn: () => fetchConstant("suitescape_fee"),
    select: (data) => (data ? parseFloat(data.value) : 0),
  });

  /* Data START */
  const guestDetails = useMemo(() => getGuestDetails(userData), [userData]);
  const bookingDetails = useMemo(
    () =>
      getBookingDetails({
        startDate: booking?.startDate,
        endDate: booking?.endDate,
        listing: booking?.listing,
      }),
    [booking?.startDate, booking?.endDate, booking?.listing],
  );
  const roomDetails = useMemo(() => {
    // Get the room details from the bookingRooms
    const roomsData = booking?.bookingRooms.map((bookingRoom) => ({
      name: bookingRoom.room.category.name,
      quantity: bookingRoom.quantity,
      price: bookingRoom.room.category.price,
    }));
    return getRoomDetails(roomsData);
  }, [booking?.bookingRooms]);
  const addonDetails = useMemo(() => {
    // Get the addon details from the bookingAddons
    const addonsData = booking?.booking_addons.map((bookingAddon) => ({
      name: bookingAddon.addon.name,
      quantity: bookingAddon.quantity,
      price: bookingAddon.price,
    }));
    return getAddOnDetails(addonsData);
  }, [booking?.booking_addons, booking?.listing]);
  const paymentDetails = useMemo(() => {
    const originalPrice = getOriginalPrice({
      grandTotal: booking?.amount,
      nights: booking?.nights,
      discountRate: DISCOUNT,
      suitescapeFee,
    });
    return getPaymentDetails({
      totalPrice: originalPrice,
      nights: booking?.nights,
      discount: DISCOUNT,
      suitescapeFee,
      isEntirePlace: booking?.listing.is_entire_place,
    });
  }, [booking?.amount, booking?.listing, booking?.nights, suitescapeFee]);
  /* Data END */

  const onChangeDates = useCallback(() => {
    navigation.navigate(Routes.CHANGE_DATES, { bookingId });
  }, [bookingId, navigation]);

  const onCancelBooking = useCallback(() => {
    navigation.navigate(Routes.CANCEL_BOOKING, { bookingId });
  }, [bookingId, navigation]);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title:
  //       booking?.status === "cancelled"
  //         ? "Booking Details"
  //         : "Edit Reservation",
  //   });
  // }, [booking?.status, navigation]);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView>
        <View style={globalStyles.rowGapSmall}>
          {booking?.status === "completed" && (
            <View style={{ ...style.container, ...style.detailsRow }}>
              <Text
                style={{
                  ...style.largeHeaderText,
                  color: Colors.green,
                }}
              >
                Bookings Completed
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={Colors.green}
              />
            </View>
          )}

          <SummaryListingView
            listing={booking?.listing}
            coverImageUrl={booking?.coverImage.url}
          />

          <DetailsPolicyView
            bookingPolicies={booking?.bookingPolicies}
            cancellationPolicy={booking?.cancellationPolicy}
            smallSpacing
          />

          <SummaryLocationView location={booking?.listing.location} />

          <SummaryListView
            label={bookingDetails.label}
            data={bookingDetails.data}
          />

          <SummaryListView
            label={guestDetails.label}
            data={guestDetails.data}
          />
          {booking?.message?.trim() && (
            <View style={style.container}>
              <View style={globalStyles.largeContainerGap}>
                <Text style={style.detailsLabel}>Message (Optional)</Text>
                <Text style={{ ...style.detailsValue, ...style.message }}>
                  {booking?.message}
                </Text>
              </View>
            </View>
          )}

          <SummaryListView label={roomDetails.label} data={roomDetails.data} />

          <SummaryListView
            label={addonDetails.label}
            data={addonDetails.data}
          />

          <SummaryListView
            label={paymentDetails.label}
            data={paymentDetails.data}
          />
        </View>

        <View
          style={{ ...globalStyles.horizontalDivider, ...style.priceDivider }}
        />

        <SummaryFooter
          label="Amount Paid"
          value={"₱" + booking?.amount.toLocaleString()}
        />
      </ScrollView>

      {booking?.status !== "cancelled" && (
        <AppFooter>
          <View style={globalStyles.buttonRow}>
            <ButtonLarge onPress={onChangeDates} flexFull>
              Change Dates
            </ButtonLarge>
            <ButtonLarge
              color={Colors.lightred}
              onPress={onCancelBooking}
              flexFull
            >
              Cancel Booking
            </ButtonLarge>
          </View>
        </AppFooter>
      )}

      <DialogLoading
        visible={isFetchingUser || isFetchingFee || isFetchingBooking}
      />
    </View>
  );
};

export default BookingDetails;
