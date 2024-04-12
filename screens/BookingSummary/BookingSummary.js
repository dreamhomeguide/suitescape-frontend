import { useQuery } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import React from "react";
import { ScrollView, Text, View } from "react-native";

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
import { useBookingContext } from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { Routes } from "../../navigation/Routes";
import { fetchProfile, fetchConstant } from "../../services/apiService";
import {
  getBookingDetails,
  getGuestDetails,
  getPaymentDetails,
} from "../../utils/getBookingDetails";

const DISCOUNT = 0.1;

const BookingSummary = ({ navigation }) => {
  const { listing } = useListingContext();
  const { room } = useRoomContext();
  const { bookingState } = useBookingContext();

  // Get the first room only as the cover image
  const {
    images: [coverImage],
  } = listing || {};

  const { data: userData, isFetching: isFetchingUser } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const { data: suitescapeFee, isFetching: isFetchingFee } = useQuery({
    queryKey: ["fees", "suitescape"],
    queryFn: () => fetchConstant("suitescape_fee"),
    select: (data) => parseFloat(data.value),
  });

  const startDate = new Date(bookingState.startDate);
  const endDate = new Date(bookingState.endDate);
  const nights = differenceInDays(endDate, startDate) || 1;

  const guestDetails = getGuestDetails(userData);
  const bookingDetails = getBookingDetails({
    startDate,
    endDate,
    listing,
    room,
  });
  const paymentDetails = getPaymentDetails({
    roomPrice: room.category.price,
    nights,
    discount: DISCOUNT,
    suitescapeFee,
  });

  const handleConfirmButton = () => {
    // setBookingData({ amount: total });
    navigation.navigate(Routes.PAYMENT_METHOD);
  };

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView>
        <View style={globalStyles.rowGapSmall}>
          <SummaryListingView
            listing={listing}
            coverImageUrl={coverImage.url}
          />

          <DetailsPolicyView
            bookingPolicies={listing.booking_policies}
            cancellationPolicy={listing.cancellation_policy}
            smallSpacing
          />

          <SummaryLocationView location={listing.location} />

          <SummaryListView
            label={bookingDetails.label}
            data={bookingDetails.data}
          />

          <SummaryListView
            label={guestDetails.label}
            data={guestDetails.data}
          />
          {bookingState.message?.trim() && (
            <View style={style.container}>
              <View style={globalStyles.largeContainerGap}>
                <Text style={style.detailsLabel}>Message (Optional)</Text>
                <Text style={{ ...style.detailsValue, ...style.message }}>
                  {bookingState.message}
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
          style={{ marginHorizontal: 20, ...globalStyles.horizontalDivider }}
        />

        <SummaryFooter
          label="Amount Paid"
          value={"₱" + paymentDetails.amount.toLocaleString()}
        />
      </ScrollView>

      <AppFooter>
        <ButtonLarge onPress={handleConfirmButton}>Confirm</ButtonLarge>
      </AppFooter>

      <DialogLoading visible={isFetchingUser || isFetchingFee} />
    </View>
  );
};

export default BookingSummary;
