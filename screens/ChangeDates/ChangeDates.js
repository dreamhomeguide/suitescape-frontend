import { useQuery } from "@tanstack/react-query";
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
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { Routes } from "../../navigation/Routes";
import { fetchBooking, fetchConstant } from "../../services/apiService";
import { getDateDetails, getPriceDetails } from "../../utils/getBookingDetails";
import selectBookingData from "../../utils/selectBookingData";
import { RNC_DATE_FORMAT } from "../SelectDates/SelectDates";

const ChangeDates = ({ navigation, route }) => {
  const bookingId = route.params.bookingId;

  const { bookingState, setBookingData } = useBookingContext();
  const { setRoom } = useRoomContext();

  const { data: bookingData, isFetching: isFetchingBooking } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId),
    select: selectBookingData,
  });

  const { data: suitescapeFee, isFetching: isFetchingFee } = useQuery({
    queryKey: ["fees", "suitescape"],
    queryFn: () => fetchConstant("suitescape_fee"),
    select: (data) => parseFloat(data.value),
  });

  // Set room context
  useEffect(() => {
    if (bookingData?.room) {
      setRoom(bookingData.room);
    }

    return () => {
      setRoom(null);
    };
  }, [bookingData?.room]);

  // Set booking data for select dates screen
  useEffect(() => {
    if (bookingData?.startDate && bookingData?.endDate) {
      setBookingData({
        startDate: format(bookingData.startDate, RNC_DATE_FORMAT),
        endDate: format(bookingData.endDate, RNC_DATE_FORMAT),
        highlightedDates: [bookingData.startDate, bookingData.endDate],
      });
    }
  }, [bookingData?.startDate, bookingData?.endDate]);

  const datesDetails = getDateDetails({
    startDate: bookingState.startDate
      ? new Date(bookingState.startDate)
      : bookingData?.startDate,
    endDate: bookingState.endDate
      ? new Date(bookingState.endDate)
      : bookingData?.endDate,
    listing: bookingData?.listing,
  });

  const priceDetails = getPriceDetails({
    startDate: new Date(bookingState.startDate),
    endDate: new Date(bookingState.endDate),
    roomPrice: bookingData?.room.category.price,
    previousAmount: bookingData?.amount,
    suitescapeFee,
  });

  const areDatesEqual = useMemo(() => {
    if (!bookingState.startDate || !bookingState.endDate) {
      return true;
    }

    const startDate = new Date(bookingState.startDate);
    const endDate = new Date(bookingState.endDate);
    return (
      startDate.toDateString() === bookingData.startDate.toDateString() &&
      endDate.toDateString() === bookingData.endDate.toDateString()
    );
  }, [
    bookingData.startDate,
    bookingData.endDate,
    bookingState.startDate,
    bookingState.endDate,
  ]);

  const amountToPay = useMemo(() => {
    const amount = priceDetails.amount - bookingData?.amount;
    return amount < 0 ? 0 : amount;
  }, [bookingData?.amount, priceDetails.amount]);

  const onCheckAvailability = useCallback(() => {
    navigation.navigate(Routes.SELECT_DATES);
  }, [navigation]);

  const handleUpdateDates = useCallback(() => {
    navigation.navigate({
      name: Routes.BOOKING_DETAILS,
      merge: true,
      params: {
        isUpdateDates: true,
        needsPayment: amountToPay > 0,
      },
    });
  }, [amountToPay, navigation]);

  const onUpdateDates = useCallback(() => {
    const startDate = new Date(bookingState.startDate);
    const endDate = new Date(bookingState.endDate);
    const nights = differenceInDays(endDate, startDate);

    if (nights < bookingData.nights) {
      Alert.alert(
        "Invalid Dates",
        "Dates should be at least the same number of nights as the original booking.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Ok", onPress: onCheckAvailability },
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
    bookingData.nights,
    bookingState.startDate,
    bookingState.endDate,
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

            <SummaryFooter
              label="Amount to Pay"
              value={"₱" + amountToPay.toLocaleString()}
            />
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
            Change Dates
          </Button>
          <Button
            onPress={onUpdateDates}
            disabled={areDatesEqual}
            containerStyle={globalStyles.flexFull}
          >
            Confirm
          </Button>
        </View>
      </AppFooter>

      <DialogLoading visible={isFetchingBooking || isFetchingFee} />
    </View>
  );
};

export default ChangeDates;
