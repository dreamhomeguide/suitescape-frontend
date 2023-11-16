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

  const { setBookingData } = useBookingContext();

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
              setBookingData({ paymentMethod: selectedMethod.label });
              navigation.navigate(Routes.FEEDBACK, {
                type: "success",
                title: "Congratulations",
                subtitle: "You Have Booked Successfully",
                screenToNavigate: Routes.BOOKINGS,
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
