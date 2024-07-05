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
import { useToast } from "react-native-toast-notifications";

import style from "./GuestInfoStyles";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import FormPicker from "../../components/FormPicker/FormPicker";
import { useBookingContext } from "../../contexts/BookingContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useSettings } from "../../contexts/SettingsContext";
import mappingsData from "../../data/mappingsData";
import { Routes } from "../../navigation/Routes";
import { fetchCities, fetchRegions } from "../../services/PSGCAPI";
import {
  fetchProfile,
  updateProfile,
  validateInfo,
} from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";
import reducerSetter from "../../utils/reducerSetter";

// const genderList = [
//   {
//     label: "Male",
//     value: "male",
//   },
//   {
//     label: "Female",
//     value: "female",
//   },
//   {
//     label: "Other",
//     value: "other",
//   },
// ];

const initialState = {
  firstName: "",
  lastName: "",
  // gender: "",
  email: "",
  address: "",
  // zipcode: "",
  city: "",
  region: "",
  mobileNumber: "",
};

const GuestInfo = ({ navigation }) => {
  const [guestState, setGuestData] = useReducer(
    reducerSetter,
    initialState,
    undefined,
  );
  const [errors, setErrors] = useState(null);

  // Destructure guest state
  const {
    firstName,
    lastName,
    // gender,
    email,
    address,
    // zipcode,
    city,
    region,
    mobileNumber,
    message,
  } = guestState;

  const scrollViewRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  // const zipcodeRef = useRef(null);
  const mobileNumberRef = useRef(null);

  const { listing } = useListingContext();
  const { setBookingData } = useBookingContext();
  const { settings } = useSettings();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !settings.guestModeEnabled,
  });

  const { data: regionData, isFetching: isFetchingRegions } = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    select: (data) => {
      return data.map((region) => {
        return {
          label: region.regionName,
          value: region.regionName,
          code: region.code,
        };
      });
    },
  });

  const regionCode = useMemo(
    () => regionData?.find((data) => data.value === region)?.code,
    [regionData, region],
  );

  const {
    data: citiesData,
    refetch: refetchCities,
    isFetching: isFetchingCities,
  } = useQuery({
    queryKey: ["cities", region],
    queryFn: () => fetchCities(regionCode),
    select: (data) => {
      return data.map((city) => {
        return {
          label: city.name,
          value: city.name,
        };
      });
    },
    enabled: !!regionCode,
  });

  useEffect(() => {
    // Sync user data to guest state
    if (userData) {
      Object.entries(mappingsData).forEach(([state, userDataKey]) => {
        if (
          userData[userDataKey] !== undefined &&
          userData[userDataKey] !== null
        ) {
          // if (state === "gender") {
          //   setBookingData({ [state]: userData[userDataKey].toLowerCase() });
          //   return;
          // }

          setGuestData({ [state]: userData[userDataKey] });
        }
      });
    }
  }, [userData]);

  // Redirect to booking summary if guest mode is enabled
  useEffect(() => {
    if (settings.guestModeEnabled) {
      navigation.replace(Routes.BOOKING_SUMMARY);
    }
  }, [navigation, settings.guestModeEnabled]);

  const abortProfileFetch = useCallback(() => {
    queryClient.cancelQueries({ queryKey: ["profile"] }).catch((err) => {
      console.log(err);
    });
  }, [queryClient]);

  const handleSuccessUpdateProfile = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onError: (e) => {
          setErrors(e.errors);
        },
        onSuccess: (res) => {
          if (settings.guestModeEnabled) {
            console.log("Profile validated: ", res);
            navigation.navigate(Routes.BOOKING_SUMMARY);
            return;
          }

          console.log(res.message);
          if (res.updated) {
            queryClient
              .invalidateQueries({ queryKey: ["profile"] })
              .then(() => console.log("Profile info invalidated"));

            // Workaround for multiple toasts flickering
            toast.hideAll();

            toast.show(res.message, {
              type: "success",
              style: toastStyles.toastInsetFooter,
            });
          }
          navigation.navigate(Routes.BOOKING_SUMMARY);
        },
      }),
    [navigation, queryClient, settings.guestModeEnabled, toast],
  );

  const handleErrorUpdateProfile = useCallback(
    (err) =>
      handleApiError({
        error: err,
        handleErrors: (e) => {
          setErrors(e.errors);
        },
      }),
    [],
  );

  const updateProfileMutation = useMutation({
    mutationFn: settings.guestModeEnabled ? validateInfo : updateProfile,
    onSuccess: handleSuccessUpdateProfile,
    onError: handleErrorUpdateProfile,
  });

  const handleUpdateProfile = useCallback(() => {
    // Convert bookingState to backend format
    const profileData = Object.entries(mappingsData).reduce(
      (acc, [state, userDataKey]) => {
        acc[userDataKey] = guestState[state];
        return acc;
      },
      {}, // initial value
    );

    // Check if the user changed fields
    // const isSavedUserData = Object.entries(profileData).every(
    //   ([key, value]) => {
    //     // If both data are empty regardless of type, return true
    //     if (!userData[key] && !value) {
    //       return true;
    //     }
    //
    //     return userData[key] === value;
    //   },
    // );

    // if (isSavedUserData) {
    //   navigation.navigate(Routes.BOOKING_SUMMARY);
    //   return;
    // }

    if (!updateProfileMutation.isPending) {
      updateProfileMutation.mutate({ profileData });
    }
  }, [guestState, updateProfileMutation.isPending]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          ref={scrollViewRef}
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={style.contentContainer}
        >
          <Text style={globalStyles.smallHeaderText}>
            Your Information Details
          </Text>
          <View
            pointerEvents={updateProfileMutation.isPending ? "none" : "auto"}
          >
            <FormInput
              value={firstName}
              onChangeText={(value) => {
                setGuestData({ firstName: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.firstName,
                  setErrors,
                );
              }}
              placeholder="First Name"
              textContentType="givenName"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                lastNameRef.current.focus();
              }}
              errorMessage={errors?.firstname}
            />
            <FormInput
              value={lastName}
              onChangeText={(value) => {
                setGuestData({ lastName: value });
                clearErrorWhenNotEmpty(value, mappingsData.lastName, setErrors);
              }}
              placeholder="Last Name"
              textContentType="familyName"
              autoCapitalize="words"
              autoCorrect={false}
              errorMessage={errors?.lastname}
              ref={lastNameRef}
            />
            {/*<FormPicker*/}
            {/*  label="Gender"*/}
            {/*  data={genderList}*/}
            {/*  value={gender}*/}
            {/*  onSelected={(value) => {*/}
            {/*    setGuestData({ gender: value });*/}
            {/*    clearErrorWhenNotEmpty(value, mappingsData.gender, setErrors);*/}
            {/*  }}*/}
            {/*  errorMessage={errors?.gender}*/}
            {/*/>*/}
            <FormInput
              value={email}
              onChangeText={(value) => {
                setGuestData({ email: value });
                clearErrorWhenNotEmpty(value, mappingsData.email, setErrors);
              }}
              placeholder="Email Address"
              // Bug: doesn't show cursor when this is on
              // keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                addressRef.current.focus();
              }}
              errorMessage={errors?.[mappingsData.email]}
              ref={emailRef}
            />
            <FormInput
              value={address}
              onChangeText={(value) => {
                setGuestData({ address: value });
                clearErrorWhenNotEmpty(value, mappingsData.address, setErrors);
              }}
              placeholder="Address"
              textContentType="fullStreetAddress"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              // onSubmitEditing={() => {
              //   zipcodeRef.current.focus();
              // }}
              errorMessage={errors?.[mappingsData.address]}
              ref={addressRef}
            />
            <FormPicker
              placeholder={isFetchingRegions ? "Loading Regions..." : "Region"}
              data={regionData}
              value={region}
              onSelected={(value) => {
                setGuestData({ region: value, city: "" });
                clearErrorWhenNotEmpty(value, mappingsData.region, setErrors);

                refetchCities().then(() => {
                  console.log("Cities refetched");
                });
              }}
              errorMessage={errors?.[mappingsData.region]}
            />
            <FormPicker
              placeholder={
                isFetchingCities || isFetchingRegions
                  ? "Loading Cities..."
                  : "City"
              }
              data={citiesData}
              value={city}
              onSelected={(value) => {
                setGuestData({ city: value });
                clearErrorWhenNotEmpty(value, mappingsData.city, setErrors);
              }}
              disabled={!region}
              onPressDisabled={() => {
                if (!region) {
                  Alert.alert("Please select a region first");
                }
              }}
              errorMessage={errors?.[mappingsData.city]}
            />
            {/*<FormInput*/}
            {/*  value={zipcode}*/}
            {/*  onChangeText={(value) => {*/}
            {/*    setGuestData({ zipcode: value });*/}
            {/*    clearErrorWhenNotEmpty(value, mappingsData.zipcode, setErrors);*/}
            {/*  }}*/}
            {/*  placeholder="Zip/Post Code"*/}
            {/*  keyboardType="number-pad"*/}
            {/*  textContentType="postalCode"*/}
            {/*  autoCorrect={false}*/}
            {/*  onSubmitEditing={() => {*/}
            {/*    mobileNumberRef.current.focus();*/}
            {/*  }}*/}
            {/*  errorMessage={errors?.[mappingsData.zipcode]}*/}
            {/*  ref={zipcodeRef}*/}
            {/*/>*/}
            <FormInput
              value={mobileNumber}
              onChangeText={(value) => {
                setGuestData({ mobileNumber: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.mobileNumber,
                  setErrors,
                );
              }}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              onFocus={() => {
                // Add phone number prefix if empty
                if (!mobileNumber) {
                  setGuestData({ mobileNumber: "+63" });
                }
              }}
              maxLength={13}
              autoCorrect={false}
              errorMessage={errors?.[mappingsData.mobileNumber]}
              ref={mobileNumberRef}
            />
            <FormInput
              type="textarea"
              value={message}
              onChangeText={(value) => {
                setBookingData({ listingId: listing.id, message: value });
              }}
              maxLength={255}
              containerStyle={style.messageContainer}
              label="Message (Optional)"
              blurOnSubmit
              returnKeyType="done"
              onFocus={() =>
                setTimeout(() => scrollViewRef.current.scrollToEnd(), 300)
              }
              errorMessage={errors?.message}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppFooter>
        <ButtonLarge onPress={handleUpdateProfile}>Continue</ButtonLarge>
      </AppFooter>

      <DialogLoading
        visible={isLoading || updateProfileMutation.isPending}
        onCancel={isLoading ? abortProfileFetch : null}
      />
    </>
  );
};

export default GuestInfo;
