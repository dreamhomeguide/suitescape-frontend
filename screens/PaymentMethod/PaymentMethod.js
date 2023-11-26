import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import style from "./PaymentMethodStyles";
import { Colors } from "../../assets/Colors";
import BDO from "../../assets/images/svgs/BDO.svg";
import GCash from "../../assets/images/svgs/GCash.svg";
import Paypal from "../../assets/images/svgs/PayPal.svg";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppHeader from "../../components/AppHeader/AppHeader";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import CheckboxCircle from "../../components/CheckboxCircle/CheckboxCircle";
import { useBookingContext } from "../../contexts/BookingContext";
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

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => SuitescapeAPI.post("/bookings", bookingData),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: (res) => {
          console.log(res.message, res.booking);

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "You Have Booked Successfully",
            screenToNavigate: Routes.BOOKINGS,
          });
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  return (
    <View style={globalStyles.flexFull}>
      <AppHeader title="Payment" />

      <Pressable
        style={style.mainContainer}
        onPress={() => setSelectedMethod(null)}
      >
        <Text style={globalStyles.smallHeaderText}>
          Select the payment method
        </Text>
        <FlatList
          data={paymentMethods}
          contentContainerStyle={style.contentContainer}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: paymentMethod }) => (
            <Pressable
              onPress={() => setSelectedMethod(paymentMethod)}
              style={{
                ...style.paymentMethodContainer,
                ...{
                  borderColor:
                    selectedMethod === paymentMethod
                      ? "black"
                      : Colors.lightgray,
                },
              }}
            >
              <View style={style.paymentMethodContentContainer}>
                {paymentMethod.icon}
                <Text style={style.text}>{paymentMethod.label}</Text>
              </View>
              <View style={style.checkboxContainer}>
                <CheckboxCircle selected={selectedMethod === paymentMethod} />
              </View>
            </Pressable>
          )}
        />
      </Pressable>

      <AppFooter>
        <ButtonLarge
          onPress={() => {
            if (selectedMethod) {
              createBookingMutation.mutate({
                coupon_id: null,
                amount: bookingState.amount,
                start_date: bookingState.startDate,
                end_date: bookingState.endDate,
                message: bookingState.message,
              });
            } else {
              Alert.alert(
                "No payment method",
                "Please select a payment method",
              );
            }
          }}
        >
          Confirm
        </ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default PaymentMethod;
