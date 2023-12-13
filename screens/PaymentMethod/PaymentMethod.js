import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import style from "./PaymentMethodStyles";
import { Colors } from "../../assets/Colors";
import BDO from "../../assets/images/svgs/BDO.svg";
import GCash from "../../assets/images/svgs/GCash.svg";
import Paypal from "../../assets/images/svgs/PayPal.svg";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import FormRadio from "../../components/FormRadio/FormRadio";
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { Routes } from "../../navigation/Routes";
import SuitescapeAPI from "../../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../../utilities/apiHelpers";

const paymentMethods = [
  {
    label: "Paypal",
    icon: <Paypal width={50} height={50} />,
  },
  {
    label: "GCash",
    icon: <GCash width={50} height={50} />,
  },
  {
    label: "BDO",
    icon: <BDO width={50} height={50} />,
  },
];

const PaymentMethod = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const { bookingState } = useBookingContext();
  const { room } = useRoomContext();
  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => SuitescapeAPI.post("/bookings", bookingData),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: (res) => {
          console.log(res.message, res.booking);

          queryClient.invalidateQueries({ queryKey: ["bookings"] }).then(() => {
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
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const onConfirm = () => {
    if (!selectedMethod) {
      Alert.alert("No payment method", "Please select a payment method");
      return;
    }

    if (createBookingMutation.isPending) {
      console.log("Booking is pending");
      return;
    }

    createBookingMutation.mutate({
      room_id: room.id,
      coupon_id: null,
      amount: bookingState.amount,
      start_date: bookingState.startDate,
      end_date: bookingState.endDate,
      message: bookingState.message,
    });
  };

  return (
    <View style={globalStyles.flexFull}>
      <View style={style.mainContainer}>
        <Text style={globalStyles.smallHeaderText}>
          Select the payment method
        </Text>
        <FlatList
          data={paymentMethods}
          contentContainerStyle={style.contentContainer}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: paymentMethod }) => (
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
                    selectedMethod === paymentMethod
                      ? Colors.blue
                      : Colors.lightgray,
                },
              }}
            >
              <View style={style.paymentMethodContentContainer}>
                {paymentMethod.icon}
                <Text style={style.text}>{paymentMethod.label}</Text>
              </View>
              <View style={style.checkboxContainer}>
                <FormRadio selected={selectedMethod === paymentMethod} />
              </View>
            </Pressable>
          )}
        />
      </View>

      <AppFooter>
        <ButtonLarge onPress={onConfirm}>Confirm</ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default PaymentMethod;
