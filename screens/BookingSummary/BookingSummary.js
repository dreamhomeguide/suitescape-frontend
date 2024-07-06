import { useQuery } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import React, { useCallback, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DetailsPolicyView from "../../components/DetailsPolicyView/DetailsPolicyView";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import SummaryListView from "../../components/SummaryListView/SummaryListView";
import SummaryListingView from "../../components/SummaryListingView/SummaryListingView";
import SummaryLocationView from "../../components/SummaryLocationView/SummaryLocationView";
import { useBookingData } from "../../contexts/BookingContext";
import { useCartData } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import {
  fetchProfile,
  fetchConstant,
  fetchListing,
} from "../../services/apiService";
import {
  getAddOnDetails,
  getBookingDetails,
  getGuestDetails,
  getPaymentDetails,
  getRoomDetails,
} from "../../utils/getBookingDetails";

const DISCOUNT = 0.1; // 10% discount

const BookingSummary = ({ navigation }) => {
  const { listing: initialData } = useListingContext();
  const { id: listingId } = initialData;
  const { settings } = useSettings();
  const cartData = useCartData();
  const bookingData = useBookingData();

  const { data: listing } = useQuery({
    queryKey: [
      "listings",
      listingId,
      bookingData.startDate,
      bookingData.endDate,
    ],
    queryFn: () =>
      fetchListing({
        listingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      }),
    initialData,
  });

  // Get the first room only as the cover image
  const {
    images: [coverImage],
  } = listing || {};

  const { data: userData, isFetching: isFetchingUser } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !settings.guestModeEnabled,
  });

  const { data: suitescapeFee, isFetching: isFetchingFee } = useQuery({
    queryKey: ["fees", "suitescape"],
    queryFn: () => fetchConstant("suitescape_fee"),
    select: (data) => parseFloat(data.value),
  });

  const startDate = bookingData.startDate && new Date(bookingData.startDate);
  const endDate = bookingData.endDate && new Date(bookingData.endDate);
  const nights = differenceInDays(endDate, startDate) || 1;

  /* Data START */
  const guestDetails = useMemo(() => getGuestDetails(userData), [userData]);
  const bookingDetails = useMemo(
    () =>
      getBookingDetails({
        startDate,
        endDate,
        listing,
      }),
    [startDate, endDate, listing],
  );
  const roomDetails = useMemo(
    () => getRoomDetails(cartData.reserved),
    [cartData.reserved],
  );
  const addonDetails = useMemo(
    () => getAddOnDetails(cartData.addons),
    [cartData.addons],
  );
  const paymentDetails = useMemo(() => {
    // Total price of rooms/listing reserved
    let totalPrice = listing.is_entire_place
      ? listing.entire_place_price
      : cartData.reservedTotal;

    // Add the addons total to the total price
    totalPrice += cartData.addonsTotal;

    return getPaymentDetails({
      totalPrice,
      nights,
      discount: DISCOUNT,
      suitescapeFee,
      isEntirePlace: listing.is_entire_place,
    });
  }, [cartData.reservedTotal, listing, nights, suitescapeFee]);
  /* Data END */

  const handleConfirmButton = useCallback(() => {
    // setBookingData({ amount: total });
    navigation.navigate(Routes.PAYMENT_METHOD);
  }, [navigation]);

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
          {bookingData.message?.trim() && (
            <View style={style.container}>
              <View style={globalStyles.largeContainerGap}>
                <Text style={style.detailsLabel}>Message (Optional)</Text>
                <Text style={{ ...style.detailsValue, ...style.message }}>
                  {bookingData.message}
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

        {/*<SummaryFooter*/}
        {/*  label="Amount To Pay"*/}
        {/*  value={"₱" + paymentDetails.amount.toLocaleString()}*/}
        {/*/>*/}
      </ScrollView>

      <AppFooter>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 20,
          }}
        >
          <Text style={style.largeHeaderText}>Amount To Pay</Text>
          <Text style={style.largeHeaderText}>
            {"₱" + paymentDetails.amount.toLocaleString()}
          </Text>
        </View>
        <ButtonLarge onPress={handleConfirmButton}>Confirm</ButtonLarge>
      </AppFooter>

      <DialogLoading visible={isFetchingUser || isFetchingFee} />
    </View>
  );
};

export default BookingSummary;
