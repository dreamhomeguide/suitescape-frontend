import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import style from "./PaymentMethodStyles";
import { Colors } from "../../assets/Colors";
import BDO from "../../assets/images/svgs/BDO.svg";
import BPI from "../../assets/images/svgs/BPI.svg";
import GCash from "../../assets/images/svgs/GCash.svg";
import Landbank from "../../assets/images/svgs/Landbank.svg";
import Metrobank from "../../assets/images/svgs/Metrobank.svg";
import PNB from "../../assets/images/svgs/PNB.svg";
import Paypal from "../../assets/images/svgs/PayPal.svg";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormRadio from "../../components/FormRadio/FormRadio";
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import {
  createBooking,
  updateBookingPaymentStatus,
} from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";

const paymentMethods = [
  {
    label: "GCash",
    icon: <GCash width={50} height={50} />,
  },
  {
    label: "Paypal",
    icon: <Paypal width={50} height={50} />,
  },
  {
    label: "BDO",
    icon: <BDO width={50} height={50} />,
  },
  {
    label: "Metrobank",
    icon: <Metrobank width={50} height={50} />,
  },
  {
    label: "PNB",
    icon: <PNB width={40} height={40} />,
  },
  {
    label: "Landbank",
    icon: <Landbank width={40} height={40} />,
  },
  {
    label: "BPI",
    icon: <BPI width={40} height={40} />,
  },
];

const PaymentMethod = ({ navigation, route }) => {
  const { bookingId, isUpdateDates } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null);

  const { bookingState } = useBookingContext();
  const { room } = useRoomContext();
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const handleSuccessCreateBooking = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res.message, res.booking);

          await queryClient
            .invalidateQueries({ queryKey: ["bookings"] })
            .then(() => {
              navigation.navigate(Routes.FEEDBACK, {
                type: "success",
                title: "Congratulations",
                subtitle: "You Have Booked Successfully",
                screenToNavigate: {
                  name: Routes.BOOKINGS,
                  params: { tab: "Upcoming" },
                },
              });
            });
        },
      }),
    [navigation, queryClient],
  );

  const handleSuccessPayBooking = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res.message, res.booking);

          await queryClient
            .invalidateQueries({ queryKey: ["bookings"] })
            .then(() => {
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
      Alert.alert("You are not logged in.");
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
      const bookingData = {
        room_id: room.id,
        coupon_code: null,
        start_date: bookingState.startDate,
        end_date: bookingState.endDate,
        message: bookingState.message,
      };

      createBookingMutation.mutate({ bookingData });
    }
  }, [
    bookingState,
    createBookingMutation.isPending,
    room,
    selectedMethod,
    settings.guestModeEnabled,
  ]);

  const renderItem = useCallback(
    ({ item: paymentMethod }) => (
      <Pressable
        onPress={() =>
          setSelectedMethod(
            paymentMethod === selectedMethod ? null : paymentMethod,
          )
        }
        style={{
          ...style.paymentMethodContainer,
          ...{
            borderColor:
              selectedMethod === paymentMethod ? Colors.blue : Colors.lightgray,
          },
        }}
      >
        <View style={style.paymentMethodContentContainer}>
          <View style={style.paymentMethodIconContainer}>
            {paymentMethod.icon}
          </View>
          <Text style={style.text}>{paymentMethod.label}</Text>
        </View>
        <View style={style.checkboxContainer}>
          <FormRadio selected={selectedMethod === paymentMethod} />
        </View>
      </Pressable>
    ),
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
