import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import style from "./GuestInfoStyles";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import FormInput from "../../components/FormInput/FormInput";
import LoadingDialog from "../../components/LoadingDialog/LoadingDialog";
import { useBookingContext } from "../../contexts/BookingContext";
import regionsList from "../../data/regionsData";
import useFetchAPI from "../../hooks/useFetchAPI";
import { Routes } from "../../navigation/Routes";
import SuitescapeAPI from "../../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../../utilities/apiHelpers";

const genderList = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

const mappings = {
  firstName: "firstname",
  lastName: "lastname",
  gender: "gender",
  email: "email",
  address: "address",
  zipCode: "zipcode",
  city: "city",
  region: "region",
  mobileNumber: "mobile_number",
  message: "message",
};

const GuestInfo = ({ navigation }) => {
  const { bookingState, setBookingData } = useBookingContext();

  // Destructure bookingState
  const {
    firstName,
    lastName,
    gender,
    email,
    address,
    zipCode,
    city,
    region,
    mobileNumber,
    message,
  } = bookingState;

  const [showGenderDropDown, setShowGenderDropDown] = useState(false);
  const [showRegionDropDown, setShowRegionDropDown] = useState(false);
  const [errors, setErrors] = useState(null);

  const scrollViewRef = useRef(null);

  const { data: userData, isLoading, abort } = useFetchAPI("/user");
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (userData) {
      Object.entries(mappings).forEach(([state, userDataKey]) => {
        if (userData[userDataKey]) {
          setBookingData({ [state]: userData[userDataKey] });
        }
      });
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: ({ profileData }) =>
      SuitescapeAPI.post("/profile", profileData),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onError: (e) => {
          setErrors(e.errors);
        },
        onSuccess: (res) => {
          console.log(res.message);
          if (res.updated) {
            toast.show(res.message, {
              type: "success",
              placement: "bottom",
              style: toastStyles.toastInsetFooter,
            });
            queryClient
              .invalidateQueries({ queryKey: ["user"] })
              .then(() => console.log("User info invalidated"));
          }

          navigation.navigate(Routes.BOOKING_SUMMARY);
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        handleErrors: (e) => {
          setErrors(e.errors);
        },
      }),
  });

  const updateProfile = () => {
    // Convert bookingState to backend format
    const profileData = Object.entries(mappings).reduce(
      (acc, [state, userDataKey]) => {
        acc[userDataKey] = bookingState[state];
        return acc;
      },
      {}, // acc - initial value
    );

    updateProfileMutation.mutate({ profileData });
  };

  const clearErrorWhenNotEmpty = (value, key) => {
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={globalStyles.flexFull}
      >
        <ScrollView
          ref={scrollViewRef}
          contentInset={{ top: 10, bottom: 15 }}
          contentContainerStyle={style.contentContainer}
        >
          <View style={style.titleContainer}>
            <Text style={globalStyles.smallHeaderText}>
              Your Information Details
            </Text>
          </View>
          <FormInput
            value={firstName}
            onChangeText={(value) => {
              setBookingData({ firstName: value });
              clearErrorWhenNotEmpty(value, mappings.firstName);
            }}
            placeholder="First Name"
            textContentType="givenName"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.firstname}
          />
          <FormInput
            value={lastName}
            onChangeText={(value) => {
              setBookingData({ lastName: value });
              clearErrorWhenNotEmpty(value, mappings.lastName);
            }}
            placeholder="Last Name"
            textContentType="familyName"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.lastname}
          />
          <FormInput
            type="dropdown"
            value={gender}
            setValue={(value) => {
              setBookingData({ gender: value });
              clearErrorWhenNotEmpty(value, mappings.gender);
            }}
            label="Gender"
            visible={showGenderDropDown}
            onDismiss={() => setShowGenderDropDown(false)}
            showDropDown={() => setShowGenderDropDown(true)}
            list={genderList}
            errorMessage={errors?.gender}
          />
          <FormInput
            value={email}
            onChangeText={(value) => {
              setBookingData({ email: value });
              clearErrorWhenNotEmpty(value, mappings.email);
            }}
            placeholder="Email Address"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.email}
          />
          <FormInput
            value={address}
            onChangeText={(value) => {
              setBookingData({ address: value });
              clearErrorWhenNotEmpty(value, mappings.address);
            }}
            placeholder="Address"
            textContentType="fullStreetAddress"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.address}
          />
          <FormInput
            value={zipCode}
            onChangeText={(value) => {
              setBookingData({ zipCode: value });
              clearErrorWhenNotEmpty(value, mappings.zipCode);
            }}
            placeholder="Zip/Post Code"
            keyboardType="number-pad"
            textContentType="postalCode"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.zipcode}
          />
          <FormInput
            value={city}
            onChangeText={(value) => {
              setBookingData({ city: value });
              clearErrorWhenNotEmpty(value, mappings.city);
            }}
            placeholder="City"
            textContentType="addressCity"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.city}
          />
          <FormInput
            type="dropdown"
            value={region}
            setValue={(value) => {
              setBookingData({ region: value });
              clearErrorWhenNotEmpty(value, mappings.region);
            }}
            label="Region"
            visible={showRegionDropDown}
            onDismiss={() => setShowRegionDropDown(false)}
            showDropDown={() => setShowRegionDropDown(true)}
            list={regionsList}
            errorMessage={errors?.region}
          />
          <FormInput
            value={mobileNumber}
            onChangeText={(value) => {
              setBookingData({ mobileNumber: value });
              clearErrorWhenNotEmpty(value, mappings.mobileNumber);
            }}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoCorrect={false}
            returnKeyType="next"
            errorMessage={errors?.mobile_number}
          />
          <FormInput
            type="textarea"
            value={message}
            onChangeText={(value) => {
              setBookingData({ message: value });
              clearErrorWhenNotEmpty(value, mappings.message);
            }}
            label="Message (Optional)"
            blurOnSubmit
            returnKeyType="done"
            onFocus={() =>
              setTimeout(() => scrollViewRef.current.scrollToEnd(), 300)
            }
            errorMessage={errors?.message}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <AppFooter>
        <ButtonLarge onPress={() => updateProfile()}>Confirm</ButtonLarge>
      </AppFooter>
      <LoadingDialog visible={isLoading} onCancel={() => abort()} />
    </>
  );
};

export default GuestInfo;
