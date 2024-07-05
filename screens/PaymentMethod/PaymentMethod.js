import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

import style from "./PaymentMethodStyles";
import GCash from "../../assets/images/svgs/payment/GCash.svg";
import Paypal from "../../assets/images/svgs/payment/PayPal.svg";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import PaymentMethodItem from "../../components/PaymentMethodItem/PaymentMethodItem";
import { useAuth } from "../../contexts/AuthContext";
import {
  useBookingContext,
  useBookingData,
} from "../../contexts/BookingContext";
import { useCartContext, useCartData } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import {
  createBooking,
  updateBookingPaymentStatus,
} from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";

const ICON_SIZE = 50;

const paymentMethods = [
  {
    label: "GCash",
    icon: <GCash width={ICON_SIZE} height={ICON_SIZE} />,
  },
  {
    label: "Paypal",
    icon: <Paypal width={ICON_SIZE} height={ICON_SIZE} />,
  },
];

const PaymentMethod = ({ navigation, route }) => {
  const { bookingId, isUpdateDates } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null);

  const { listing } = useListingContext();
  const { settings } = useSettings();
  const { disableGuestMode } = useAuth();
  const { clearCart } = useCartContext();
  const { clearBookingInfo } = useBookingContext();
  const bookingData = useBookingData();
  const cartData = useCartData();
  const queryClient = useQueryClient();

  const handleSuccessCreateBooking = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res.message, res.booking);

          // Invalidate the queries to update the UI
          await queryClient.invalidateQueries({ queryKey: ["bookings"] });
          await queryClient.invalidateQueries({
            queryKey: ["listings", listing.id],
          });

          // Clear the cart and booking after successful booking
          clearBookingInfo({ listingId: listing.id });
          clearCart({ listingId: listing.id });
          console.log("Cleared cart and booking info");

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "You Have Booked Successfully",
            screenToNavigate: {
              name: Routes.BOOKINGS,
              params: { tab: "Upcoming" },
            },
          });
        },
      }),
    [listing.id, listing.is_entire_place, navigation, queryClient],
  );

  const handleSuccessPayBooking = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res.message, res.booking);

          await queryClient.invalidateQueries({
            queryKey: ["bookings", "user"],
            exact: true,
          });

          await queryClient.invalidateQueries({
            queryKey: ["bookings", bookingId],
          });

          if (isUpdateDates) {
            navigation.navigate(Routes.FEEDBACK, {
              type: "success",
              title: "Congratulations",
              subtitle: "Dates updated successfully",
              screenToNavigate: {
                name: Routes.BOOKING_DETAILS,
                params: { bookingId },
              },
            });
            return;
          }

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "Booking Payment Successful",
            screenToNavigate: {
              name: Routes.BOOKINGS,
              params: { tab: "Upcoming" },
            },
          });
        },
      }),
    [navigation, queryClient],
  );

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: handleSuccessCreateBooking,
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const payBookingMutation = useMutation({
    mutationFn: ({ bookingId }) =>
      updateBookingPaymentStatus({ bookingId, status: "paid" }),
    onSuccess: handleSuccessPayBooking,
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const handleConfirmPayment = useCallback(() => {
    if (!selectedMethod) {
      Alert.alert("No payment method", "Please select a payment method");
      return;
    }

    if (settings.guestModeEnabled) {
      Alert.alert(
        "Guest Mode",
        "You are currently in guest mode. Please sign in to continue.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => disableGuestMode(),
            style: "destructive",
          },
        ],
      );

      return;
    }

    // If there is a bookingId, it means the user is paying for an existing booking
    if (bookingId) {
      if (!payBookingMutation.isPending) {
        payBookingMutation.mutate({ bookingId });
      }
      return;
    }

    // Create a new booking
    if (!createBookingMutation.isPending) {
      // Transform rooms and addons format required by the API
      const rooms = cartData.reserved.reduce((acc, curr) => {
        acc[curr.id] = curr.quantity;
        return acc;
      }, {});

      const addons = cartData.addons.reduce((acc, curr) => {
        acc[curr.id] = curr.quantity;
        return acc;
      }, {});

      const newBooking = {
        listing_id: listing.id,
        rooms: JSON.stringify(rooms),
        addons: JSON.stringify(addons),
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        message: bookingData.message,
        coupon_code: null,
      };

      createBookingMutation.mutate({ bookingData: newBooking });
    }
  }, [
    bookingData,
    cartData.addons,
    cartData.reserved,
    createBookingMutation.isPending,
    listing.id,
    selectedMethod,
    settings.guestModeEnabled,
  ]);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedMethod === item;
      return (
        <PaymentMethodItem
          item={item}
          isSelected={isSelected}
          onPress={() => setSelectedMethod(isSelected ? null : item)}
        />
      );
    },
    [selectedMethod],
  );

  return (
    <View style={globalStyles.flexFull}>
      <View style={style.mainContainer}>
        <Text style={globalStyles.smallHeaderText}>
          Select the payment method
        </Text>
      </View>

      <FlatList
        data={paymentMethods}
        contentContainerStyle={style.contentContainer}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />

      <AppFooter>
        <ButtonLarge onPress={handleConfirmPayment}>Confirm</ButtonLarge>
      </AppFooter>

      <DialogLoading visible={createBookingMutation.isPending} />
    </View>
  );
};

export default PaymentMethod;
