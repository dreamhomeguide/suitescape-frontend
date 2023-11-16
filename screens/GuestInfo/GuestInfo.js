import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import style from "./GuestInfoStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppHeader from "../../components/AppHeader/AppHeader";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import FormInput from "../../components/FormInput/FormInput";
import LoadingDialog from "../../components/LoadingDialog/LoadingDialog";
import { useBookingContext } from "../../contexts/BookingContext";
import regionsList from "../../data/regionsData";
import useFetchAPI from "../../hooks/useFetchAPI";
import { Routes } from "../../navigation/Routes";

const genderList = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const GuestInfo = ({ navigation }) => {
  const { bookingState, setBookingData } = useBookingContext();
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

  const { data: userData, isLoading, abort } = useFetchAPI("/user");

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (userData) {
      // stateKey: userDataKey
      const mappings = {
        firstName: "firstname",
        lastName: "lastname",
        email: "email",
        mobileNumber: "mobile_number",
      };

      for (const [stateKey, userDataKey] of Object.entries(mappings)) {
        if (!bookingState[stateKey]) {
          setBookingData({ [stateKey]: userData[userDataKey] });
        }
      }
    }
  }, [userData]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={globalStyles.flexFull}
      >
        <AppHeader title="Guest Info" />
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
            onChangeText={(text) => {
              setBookingData({ firstName: text });
            }}
            placeholder="First Name"
            textContentType="givenName"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            value={lastName}
            onChangeText={(text) => {
              setBookingData({ lastName: text });
            }}
            placeholder="Last Name"
            textContentType="familyName"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            type="dropdown"
            value={gender}
            setValue={(value) => {
              setBookingData({ gender: value });
            }}
            label="Gender"
            visible={showGenderDropDown}
            onDismiss={() => setShowGenderDropDown(false)}
            showDropDown={() => setShowGenderDropDown(true)}
            list={genderList}
          />
          <FormInput
            value={email}
            onChangeText={(text) => {
              setBookingData({ email: text });
            }}
            placeholder="Email Address"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            value={address}
            onChangeText={(text) => {
              setBookingData({ address: text });
            }}
            placeholder="Address"
            textContentType="fullStreetAddress"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            value={zipCode}
            onChangeText={(text) => {
              setBookingData({ zipCode: text });
            }}
            placeholder="Zip/Post Code"
            keyboardType="number-pad"
            textContentType="postalCode"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            value={city}
            onChangeText={(text) => {
              setBookingData({ city: text });
            }}
            placeholder="City"
            textContentType="addressCity"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            type="dropdown"
            value={region}
            setValue={(value) => {
              setBookingData({ region: value });
            }}
            label="Region"
            visible={showRegionDropDown}
            onDismiss={() => setShowRegionDropDown(false)}
            showDropDown={() => setShowRegionDropDown(true)}
            list={regionsList}
          />
          <FormInput
            value={mobileNumber}
            onChangeText={(text) => {
              setBookingData({ mobileNumber: text });
            }}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoCorrect={false}
            returnKeyType="next"
          />
          <FormInput
            type="textarea"
            value={message}
            onChangeText={(text) => {
              setBookingData({ message: text });
            }}
            label="Message (Optional)"
            blurOnSubmit
            returnKeyType="done"
            onFocus={() =>
              setTimeout(() => scrollViewRef.current.scrollToEnd(), 300)
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <AppFooter>
        <ButtonLarge
          onPress={() => navigation.navigate(Routes.BOOKING_SUMMARY)}
        >
          Confirm
        </ButtonLarge>
      </AppFooter>
      <LoadingDialog visible={isLoading} onCancel={() => abort()} />
    </>
  );
};

export default GuestInfo;
