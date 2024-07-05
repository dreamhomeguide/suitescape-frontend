import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import SummaryFooter from "../../components/SummaryFooter/SummaryFooter";
import SummaryListView from "../../components/SummaryListView/SummaryListView";
import { Routes } from "../../navigation/Routes";
import { fetchBooking } from "../../services/apiService";
import { getDateDetails } from "../../utils/getBookingDetails";
import selectBookingData from "../../utils/selectBookingData";

const CancelBooking = ({ navigation, route }) => {
  const bookingId = route.params.bookingId;

  const { data: booking, isFetching } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBooking(bookingId),
    select: selectBookingData,
  });

  const datesDetails = getDateDetails({
    startDate: booking?.startDate,
    endDate: booking?.endDate,
    listing: booking?.listing,
  });

  const cancellationDetails = {
    label: "Booking Cancellation",
    data: [
      {
        label: `${booking?.listing.name} Cancellation Fee`,
        value:
          booking?.cancellationFee > 0
            ? "₱" +
              (booking?.cancellationFee - booking?.suitescapeCancellationFee)
            : "Free",
      },
      {
        label: "Suitescape Canellation Fee",
        value:
          booking?.cancellationFee > 0
            ? "₱" + booking?.suitescapeCancellationFee
            : "Free",
      },
    ],
  };

  const onCancelBooking = useCallback(() => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () =>
            navigation.navigate(Routes.CANCELLATION_FEEDBACK, { bookingId }),
        },
      ],
    );
  }, []);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView contentContainerStyle={globalStyles.rowGapSmall}>
        <View style={style.container}>
          <Text style={style.headerText}>Cancel Booking</Text>
          <Text>
            Are you sure you want to cancel this booking? Please be informed
            that upon confirming the cancellation, the entire reservation will
            be cancelled.
          </Text>
        </View>

        <SummaryListView label={datesDetails.label} data={datesDetails.data} />

        <SummaryListView
          label={cancellationDetails.label}
          data={cancellationDetails.data}
        />

        <SummaryFooter
          label="Cancellation Fee"
          value={"₱" + booking?.cancellationFee}
        />
      </ScrollView>

      <AppFooter>
        <ButtonLarge onPress={onCancelBooking} color={Colors.lightred}>
          Cancel Booking
        </ButtonLarge>
      </AppFooter>

      <DialogLoading visible={isFetching} />
    </View>
  );
};

export default CancelBooking;
