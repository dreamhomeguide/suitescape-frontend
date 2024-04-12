import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { ScrollView, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import Button from "../../components/Button/Button";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DetailsPolicyView from "../../components/DetailsPolicyView/DetailsPolicyView";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import SummaryFooter from "../../components/SummaryFooter/SummaryFooter";
import SummaryListView from "../../components/SummaryListView/SummaryListView";
import SummaryListingView from "../../components/SummaryListingView/SummaryListingView";
import SummaryLocationView from "../../components/SummaryLocationView/SummaryLocationView";
import { useBookingContext } from "../../contexts/BookingContext";
import { Routes } from "../../navigation/Routes";
import {
  fetchProfile,
  fetchConstant,
  fetchBooking,
  updateBookingDates,
} from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";
import {
  getBookingDetails,
  getGuestDetails,
  getPaymentDetails,
} from "../../utils/getBookingDetails";
import selectBookingData from "../../utils/selectBookingData";

const DISCOUNT = 0.1;

const BookingDetails = ({ navigation, route }) => {
  const { bookingId, isUpdateDates, needsPayment } = route.params || {};

  const { bookingState, clearDates } = useBookingContext();

  const queryClient = useQueryClient();

  // Clear dates on unmount
  useEffect(() => {
    return () => clearDates();
  }, []);

  const { data: bookingData, isFetching: isFetchingBooking } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId),
    select: selectBookingData,
  });

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

  const guestDetails = getGuestDetails(userData);
  const bookingDetails = getBookingDetails({
    startDate: bookingData?.startDate,
    endDate: bookingData?.endDate,
    listing: bookingData?.listing,
    room: bookingData?.room,
  });
  const paymentDetails = getPaymentDetails({
    roomPrice: bookingData?.room.category.price,
    nights: bookingData?.nights,
    discount: DISCOUNT,
    suitescapeFee,
  });

  const onCancelBooking = useCallback(() => {
    navigation.navigate(Routes.CANCEL_BOOKING, { bookingId });
  }, [bookingId, navigation]);

  const onChangeDates = useCallback(() => {
    navigation.navigate(Routes.CHANGE_DATES, { bookingId });
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
        startDate: bookingState.startDate,
        endDate: bookingState.endDate,
      });
    }
  }, [
    bookingId,
    bookingState.startDate,
    bookingState.endDate,
    changeDatesMutation.isPending,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        bookingData?.status === "cancelled"
          ? "Booking Details"
          : "Edit Reservation",
    });
  }, [bookingData?.status, navigation]);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView>
        <View style={globalStyles.rowGapSmall}>
          {bookingData?.status === "completed" && (
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
            listing={bookingData?.listing}
            coverImageUrl={bookingData?.coverImage.url}
          />

          <DetailsPolicyView
            bookingPolicies={bookingData?.bookingPolicies}
            cancellationPolicy={bookingData?.cancellationPolicy}
            smallSpacing
          />

          <SummaryLocationView location={bookingData?.listing.location} />

          <SummaryListView
            label={bookingDetails.label}
            data={bookingDetails.data}
          />

          <SummaryListView
            label={guestDetails.label}
            data={guestDetails.data}
          />
          {bookingData?.message?.trim() && (
            <View style={style.container}>
              <View style={globalStyles.largeContainerGap}>
                <Text style={style.detailsLabel}>Message (Optional)</Text>
                <Text style={{ ...style.detailsValue, ...style.message }}>
                  {bookingData?.message}
                </Text>
              </View>
            </View>
          )}

          <SummaryListView
            label={paymentDetails.label}
            data={paymentDetails.data}
          />
        </View>

        <View
          style={{ ...globalStyles.horizontalDivider, ...style.priceDivider }}
        />

        {/* Uncomment only after coupon functionality is done: (uses backend for amount) */}
        {/*<SummaryFooter label={'Amount Paid'} value={"₱" + bookingData?.amount.toLocaleString()} /> */}

        <SummaryFooter
          label="Amount Paid"
          value={"₱" + paymentDetails.amount.toLocaleString()}
        />
      </ScrollView>

      {bookingData?.status !== "cancelled" && (
        <AppFooter>
          {needsPayment ? (
            <ButtonLarge onPress={handleDatesPayment}>Pay now</ButtonLarge>
          ) : isUpdateDates ? (
            <ButtonLarge onPress={handleUpdateDates}>Confirm</ButtonLarge>
          ) : (
            <View style={globalStyles.buttonRow}>
              <Button
                outlined
                containerStyle={globalStyles.flexFull}
                color={Colors.lightred}
                onPress={onCancelBooking}
              >
                Cancel Booking
              </Button>

              <Button
                containerStyle={globalStyles.flexFull}
                color={Colors.lightred}
                onPress={onChangeDates}
              >
                Edit Dates
              </Button>
            </View>
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
