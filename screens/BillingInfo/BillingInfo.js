import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import FormPicker from "../../components/FormPicker/FormPicker";
import {
  useBookingContext,
  useBookingData,
} from "../../contexts/BookingContext";
import { useCartContext } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useSettings } from "../../contexts/SettingsContext";
import mappingsData from "../../data/mappingsData";
import useAddress from "../../hooks/useAddress";
import { Routes } from "../../navigation/Routes";
import {
  createPayment,
  fetchBooking,
  fetchProfile,
  updateBookingDates,
} from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";
import { checkEmptyFieldsObj } from "../../utils/emptyFieldChecker";
import flattenErrors from "../../utils/flattenErrors";
import reducerSetter from "../../utils/reducerSetter";
import selectBookingData from "../../utils/selectBookingData";
import style from "../GuestInfo/GuestInfoStyles";

const initialState = {
  cardNumber: "",
  expMonth: "",
  expYear: "",
  cvc: "",
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  address: "",
  region: "",
  province: "",
  city: "",
};

const BillingInfo = ({ navigation }) => {
  const [billingData, setBillingData] = useReducer(
    reducerSetter,
    initialState,
    undefined,
  );
  const [errors, setErrors] = useState(null);

  const {
    cardNumber,
    expMonth,
    expYear,
    cvc,
    firstName,
    lastName,
    email,
    mobileNumber,
    address,
    region,
    province,
    city,
  } = billingData;

  const expMonthRef = useRef(null);
  const expYearRef = useRef(null);
  const cvcRef = useRef(null);

  const { listing } = useListingContext();
  const { setBookingData, clearBookingInfo } = useBookingContext();
  const { clearCart } = useCartContext();
  const { settings } = useSettings();
  const bookingData = useBookingData();
  const queryClient = useQueryClient();

  const { data: booking, isFetching: isFetchingBooking } = useQuery({
    queryKey: ["bookings", bookingData.bookingId],
    queryFn: () => fetchBooking(bookingData.bookingId),
    select: selectBookingData,
    enabled: !!bookingData.bookingId,
  });

  const { data: userData, isFetching: isFetchingUser } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !settings.guestModeEnabled,
  });

  const {
    regionData,
    provincesData,
    refetchProvinces,
    citiesData,
    refetchCities,
  } = useAddress({ region, province });

  useEffect(() => {
    if (userData) {
      setBillingData({
        firstName: userData.firstname,
        lastName: userData.lastname,
        email: userData.email,
        mobileNumber: userData.mobile_number,
        address: userData.address,
        region: userData.region,
        province: userData.state,
        city: userData.city,
      });
    }
  }, [userData]);

  const handleSuccessPayBooking = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res.message, res.booking, res.payment);

          await queryClient.invalidateQueries({
            queryKey: ["bookings", "user"],
            exact: true,
          });

          await queryClient.invalidateQueries({
            queryKey: ["bookings", bookingData.bookingId],
          });

          // Clear the booking info to reset the dates
          clearBookingInfo({ listingId: listing.id });

          // Clear the cart after successful booking
          clearCart({ listingId: listing.id });

          // Do not navigate to the feedback screen if the user is updating the dates
          if (bookingData.isUpdateDates) {
            return;
          }

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "Booking Payment Successful",
            screenToNavigate: {
              name: Routes.BOOKING_DETAILS,
              params: { bookingId: bookingData.bookingId },
            },
          });
        },
      }),
    [bookingData, listing?.id, navigation, queryClient],
  );

  const handleFailurePayBooking = useCallback(
    (err) =>
      handleApiError({
        error: err,
        handleErrors: (e) => {
          // If the error is not from Paymongo, parse accordingly
          if (!e.is_paymongo_error) {
            setErrors(flattenErrors(e.errors));
            return;
          }

          // Parse the error message from Paymongo and set it to the state
          let errors = JSON.parse(e.message).errors;

          // Convert the array of errors to an object
          errors = errors.reduce((acc, error) => {
            acc[error.source.attribute] = [error.detail];
            return acc;
          }, {});

          setErrors(errors);
        },
      }),
    [],
  );

  const payWithCardMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: handleSuccessPayBooking,
    onError: handleFailurePayBooking,
  });

  const changeDatesMutation = useMutation({
    mutationFn: updateBookingDates,
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  useEffect(() => {
    if (
      bookingData.isUpdateDates &&
      payWithCardMutation.isSuccess &&
      changeDatesMutation.isSuccess
    ) {
      navigation.navigate(Routes.FEEDBACK, {
        type: "success",
        title: "Congratulations",
        subtitle: "Dates updated successfully",
        screenToNavigate: {
          name: Routes.BOOKING_DETAILS,
          params: { bookingId: bookingData.bookingId },
        },
      });
    }
  }, [
    bookingData.isUpdateDates,
    changeDatesMutation.isSuccess,
    payWithCardMutation.isSuccess,
    navigation,
  ]);

  const isNotChanged = useMemo(
    () => checkEmptyFieldsObj(billingData),
    [billingData],
  );

  const handleCardPayment = useCallback(() => {
    setBookingData({ listingId: listing.id, billing: billingData });

    const paymentMethodDetails = {
      [mappingsData.cardNumber]: billingData.cardNumber,
      [mappingsData.expMonth]: parseInt(billingData.expMonth, 10),
      [mappingsData.expYear]: parseInt(billingData.expYear, 10),
      [mappingsData.cvc]: billingData.cvc,
    };

    const billingDetails = {
      name: `${billingData.firstName} ${billingData.lastName}`,
      email: billingData.email,
      phone: billingData.mobileNumber,
    };

    const billingAddress = {
      line1: billingData.address,
      city: billingData.city,
      state: billingData.province,
    };

    if (payWithCardMutation.isPending || changeDatesMutation.isPending) {
      return;
    }

    payWithCardMutation.mutate({
      paymentData: {
        booking_id: bookingData.bookingId,
        amount: bookingData.isUpdateDates
          ? bookingData.newAmount
          : booking?.amount,
        description: "Payment for booking " + bookingData.bookingId,
        payment_method_type: "card",
        payment_method_details: paymentMethodDetails,
        billing_details: billingDetails,
        billing_address: billingAddress,
      },
    });

    if (bookingData.isUpdateDates) {
      changeDatesMutation.mutate({
        bookingId: bookingData.bookingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });
    }
  }, [
    billingData,
    bookingData,
    changeDatesMutation.isPending,
    listing?.id,
    payWithCardMutation.isPending,
  ]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={style.contentContainer}
        >
          <View>
            <Text style={globalStyles.smallHeaderText}>Card Details</Text>

            <FormInput
              value={cardNumber}
              onChangeText={(value) => {
                setBillingData({ cardNumber: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.cardNumber,
                  setErrors,
                );
              }}
              label="Card Number"
              placeholder="Enter card number"
              keyboardType="number-pad"
              textContentType="creditCardNumber"
              autoCorrect={false}
              onSubmitEditing={() => {
                expMonthRef.current.focus();
              }}
              errorMessage={errors?.[mappingsData.cardNumber]}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                columnGap: 10,
              }}
            >
              <FormInput
                value={expMonth}
                onChangeText={(value) => {
                  setBillingData({ expMonth: value });
                  clearErrorWhenNotEmpty(
                    value,
                    mappingsData.expMonth,
                    setErrors,
                  );
                }}
                label="Exp Month"
                placeholder="MM"
                keyboardType="number-pad"
                textContentType="creditCardExpirationMonth"
                maxLength={2}
                autoCorrect={false}
                onSubmitEditing={() => {
                  expYearRef.current.focus();
                }}
                ref={expMonthRef}
                containerStyle={globalStyles.flexFull}
                errorMessage={errors?.[mappingsData.expMonth]}
              />
              <FormInput
                value={expYear}
                onChangeText={(value) => {
                  setBillingData({ expYear: value });
                  clearErrorWhenNotEmpty(
                    value,
                    mappingsData.expYear,
                    setErrors,
                  );
                }}
                label="Exp Year"
                placeholder="YYYY"
                keyboardType="number-pad"
                textContentType="creditCardExpirationYear"
                maxLength={4}
                autoCorrect={false}
                onSubmitEditing={() => {
                  cvcRef.current.focus();
                }}
                ref={expYearRef}
                containerStyle={globalStyles.flexFull}
                errorMessage={errors?.[mappingsData.expYear]}
              />
            </View>

            <FormInput
              value={cvc}
              onChangeText={(value) => {
                setBillingData({ cvc: value });
                clearErrorWhenNotEmpty(value, mappingsData.cvc, setErrors);
              }}
              label="CVC"
              placeholder="Enter CVC"
              keyboardType="number-pad"
              textContentType="creditCardSecurityCode"
              maxLength={3}
              autoCorrect={false}
              ref={cvcRef}
              errorMessage={errors?.[mappingsData.cvc]}
            />
          </View>

          <View>
            <Text style={globalStyles.smallHeaderText}>Billing Details</Text>

            <FormInput
              value={firstName}
              onChangeText={(value) => {
                setBillingData({ firstName: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.firstName,
                  setErrors,
                );
              }}
              placeholder="First Name"
              errorMessage={errors?.[mappingsData.firstName]}
            />
            <FormInput
              value={lastName}
              onChangeText={(value) => {
                setBillingData({ lastName: value });
                clearErrorWhenNotEmpty(value, mappingsData.lastname, setErrors);
              }}
              placeholder="Last Name"
              errorMessage={errors?.[mappingsData.lastName]}
            />
            <FormInput
              value={email}
              onChangeText={(value) => {
                setBillingData({ email: value });
                clearErrorWhenNotEmpty(value, mappingsData.email, setErrors);
              }}
              placeholder="Email"
              errorMessage={errors?.[mappingsData.email]}
            />
            <FormInput
              value={mobileNumber}
              onChangeText={(value) => {
                setBillingData({ mobileNumber: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.mobileNumber,
                  setErrors,
                );
              }}
              placeholder="Mobile Number"
              errorMessage={errors?.[mappingsData.mobileNumber]}
            />
          </View>

          <View>
            <Text style={globalStyles.smallHeaderText}>Billing Address</Text>

            <FormInput
              value={address}
              onChangeText={(value) => {
                setBillingData({ address: value });
                clearErrorWhenNotEmpty(value, mappingsData.address, setErrors);
              }}
              placeholder="Address"
              errorMessage={errors?.[mappingsData.address]}
            />
            <FormPicker
              placeholder="Region"
              data={regionData}
              value={region}
              onSelected={(value) => {
                setBillingData({ region: value, province: "", city: "" });
                clearErrorWhenNotEmpty(value, mappingsData.region, setErrors);

                refetchProvinces().then(() => {
                  console.log("Provinces refetched");
                });
              }}
              errorMessage={errors?.[mappingsData.region]}
            />
            <FormPicker
              placeholder="Province"
              data={provincesData}
              value={province}
              onSelected={(value) => {
                setBillingData({ province: value, city: "" });
                clearErrorWhenNotEmpty(value, mappingsData.province, setErrors);

                refetchCities().then(() => {
                  console.log("Cities refetched");
                });
              }}
              disabled={!region}
              onPressDisabled={() => {
                if (!region) {
                  Alert.alert("Please select a region first");
                }
              }}
              errorMessage={errors?.[mappingsData.province]}
            />
            <FormPicker
              placeholder="City"
              data={citiesData}
              value={city}
              onSelected={(value) => {
                setBillingData({ city: value });
                clearErrorWhenNotEmpty(value, mappingsData.city, setErrors);
              }}
              disabled={!province}
              onPressDisabled={() => {
                if (!province) {
                  Alert.alert("Please select a province first");
                }
              }}
              errorMessage={errors?.[mappingsData.city]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppFooter>
        <ButtonLarge onPress={handleCardPayment} disabled={isNotChanged}>
          Continue
        </ButtonLarge>
      </AppFooter>

      <DialogLoading
        visible={
          isFetchingBooking || isFetchingUser || payWithCardMutation.isPending
        }
      />
    </>
  );
};

export default BillingInfo;
