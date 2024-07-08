import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInDays, format } from "date-fns";
import React, { useCallback, useEffect, useMemo } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import Button from "../../components/Button/Button";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import SummaryFooter from "../../components/SummaryFooter/SummaryFooter";
import SummaryListView from "../../components/SummaryListView/SummaryListView";
import {
  useBookingContext,
  useBookingData,
} from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { RNC_DATE_FORMAT } from "../../hooks/useDates";
import { Routes } from "../../navigation/Routes";
import {
  fetchBooking,
  fetchConstant,
  updateBookingDates,
} from "../../services/apiService";
import { handleApiError } from "../../utils/apiHelpers";
import {
  getDateDetails,
  getOriginalPrice,
  getPriceDetails,
} from "../../utils/getBookingDetails";
import selectBookingData from "../../utils/selectBookingData";

const DISCOUNT = 0.1; // 10% discount

const ChangeDates = ({ navigation, route }) => {
  const bookingId = route.params.bookingId;

  const { setListing } = useListingContext();
  const { setRoom } = useRoomContext();
  const { setBookingData } = useBookingContext();
  const bookingData = useBookingData();
  const queryClient = useQueryClient();

  const { data: booking, isFetching: isFetchingBooking } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId),
    select: selectBookingData,
  });

  const { data: suitescapeFee, isFetching: isFetchingFee } = useQuery({
    queryKey: ["fees", "suitescape"],
    queryFn: () => fetchConstant("suitescape_fee"),
    select: (data) => parseFloat(data.value),
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

  // Set listing and room context
  useEffect(() => {
    if (booking?.listing) {
      setListing(booking.listing);
    }

    if (booking?.room) {
      setRoom(booking.room);
    }

    return () => {
      setListing(null);
      setRoom(null);
    };
  }, [booking?.listing, booking?.room]);

  // Set booking data for select dates screen
  useEffect(() => {
    if (booking?.startDate && booking?.endDate && booking?.listing.id) {
      setBookingData({
        listingId: booking.listing.id,
        startDate: format(booking.startDate, RNC_DATE_FORMAT),
        endDate: format(booking.endDate, RNC_DATE_FORMAT),
        highlightedDates: [booking.startDate, booking.endDate],
      });
    }
  }, [booking?.startDate, booking?.endDate, booking?.listing.id]);

  const datesDetails = getDateDetails({
    startDate: bookingData.startDate
      ? new Date(bookingData.startDate)
      : booking?.startDate,
    endDate: bookingData.endDate
      ? new Date(bookingData.endDate)
      : booking?.endDate,
    listing: booking?.listing,
  });

  const priceDetails = useMemo(() => {
    const originalPrice = getOriginalPrice({
      grandTotal: booking?.amount,
      nights: booking?.nights,
      discountRate: DISCOUNT,
      suitescapeFee,
    });
    return getPriceDetails({
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
      pricePerNight: originalPrice,
      prevAmount: booking?.amount,
      suitescapeFee,
    });
  }, [
    booking?.amount,
    booking?.nights,
    bookingData.startDate,
    bookingData.endDate,
    suitescapeFee,
  ]);

  const areDatesEqual = useMemo(() => {
    if (!bookingData.startDate || !bookingData.endDate) {
      return true;
    }

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    return (
      startDate.toDateString() === booking.startDate.toDateString() &&
      endDate.toDateString() === booking.endDate.toDateString()
    );
  }, [
    booking.startDate,
    booking.endDate,
    bookingData.startDate,
    bookingData.endDate,
  ]);

  const amountToPay = useMemo(() => {
    const amount = priceDetails.amount - booking?.amount;
    return amount < 0 ? -1 : amount;
  }, [booking?.amount, priceDetails.amount]);

  const onCheckAvailability = useCallback(() => {
    navigation.navigate(Routes.SELECT_DATES);
  }, [navigation]);

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

  const onUpdateDates = useCallback(() => {
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const nights = differenceInDays(endDate, startDate);

    if (nights < booking.nights) {
      Alert.alert(
        "Invalid Dates",
        "Dates should be at least the same number of nights as the original booking.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Edit Dates", onPress: onCheckAvailability },
        ],
      );
      return;
    }

    Alert.alert("Update Dates", "Are you sure you want to update the dates?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: handleUpdateDates,
      },
    ]);
  }, [
    booking.nights,
    bookingData.startDate,
    bookingData.endDate,
    handleUpdateDates,
    onCheckAvailability,
  ]);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView contentContainerStyle={globalStyles.rowGapSmall}>
        <View style={style.container}>
          <Text style={style.headerText}>Choose alternative dates</Text>
          <Text>Change of plans? Choose your alternative dates.</Text>
        </View>

        <SummaryListView label={datesDetails.label} data={datesDetails.data} />

        {!areDatesEqual && (
          <>
            <SummaryListView
              label={priceDetails.label}
              data={priceDetails.data}
            />

            {amountToPay > 0 && (
              <SummaryFooter
                label="Amount to Pay"
                value={"₱" + amountToPay.toLocaleString()}
              />
            )}
          </>
        )}
      </ScrollView>

      <AppFooter>
        <View style={globalStyles.buttonRow}>
          <Button
            onPress={onCheckAvailability}
            outlined
            containerStyle={globalStyles.flexFull}
          >
            Edit Dates
          </Button>
          <Button
            onPress={amountToPay > 0 ? handleDatesPayment : onUpdateDates}
            disabled={areDatesEqual}
            containerStyle={globalStyles.flexFull}
          >
            {amountToPay > 0 ? "Pay Now" : "Confirm"}
          </Button>
        </View>
      </AppFooter>

      <DialogLoading visible={isFetchingBooking || isFetchingFee} />
    </View>
  );
};

export default ChangeDates;
