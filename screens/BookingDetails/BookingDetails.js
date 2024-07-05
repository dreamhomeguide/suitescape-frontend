import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useBookingData } from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { Routes } from "../../navigation/Routes";
import {
  fetchProfile,
  fetchConstant,
  fetchBooking,
  updateBookingDates,
} from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";
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
  const { bookingId, isUpdateDates, needsPayment } = route.params || {};

  const { setListing } = useListingContext();
  const bookingData = useBookingData();
  const queryClient = useQueryClient();

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

  const changeDatesMutation = useMutation({
    mutationFn: updateBookingDates,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["bookings", bookingId],
      });

      navigation.navigate(Routes.FEEDBACK, {
        type: "success",
        title: "Congratulations",
        subtitle: "Dates updated successfully",
        screenToNavigate: {
          name: Routes.BOOKING_DETAILS,
          params: { bookingId },
        },
      });
    },
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
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

  const onCancelBooking = useCallback(() => {
    navigation.navigate(Routes.CANCEL_BOOKING, { bookingId });
  }, [bookingId, navigation]);

  const handleDatesPayment = useCallback(() => {
    navigation.navigate(Routes.PAYMENT_METHOD, {
      bookingId,
      isUpdateDates: true,
    });
  }, [bookingId, navigation]);

  const handleUpdateDates = useCallback(() => {
    if (!changeDatesMutation.isPending) {
      changeDatesMutation.mutate({
        bookingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });
    }
  }, [
    bookingId,
    bookingData.startDate,
    bookingData.endDate,
    changeDatesMutation.isPending,
  ]);

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
          {needsPayment ? (
            <ButtonLarge onPress={handleDatesPayment}>Pay now</ButtonLarge>
          ) : isUpdateDates ? (
            <ButtonLarge onPress={handleUpdateDates}>Confirm</ButtonLarge>
          ) : (
            <ButtonLarge color={Colors.lightred} onPress={onCancelBooking}>
              Cancel Booking
            </ButtonLarge>
          )}
        </AppFooter>
      )}

      <DialogLoading
        visible={isFetchingUser || isFetchingFee || isFetchingBooking}
      />
    </View>
  );
};

export default BookingDetails;
