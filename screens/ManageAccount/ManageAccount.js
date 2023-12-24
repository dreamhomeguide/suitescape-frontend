import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useEffect, useReducer, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import { Colors } from "../../assets/Colors";
import globalStyles, {
  pressedBgColor,
  pressedOpacity,
} from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import useFetchAPI from "../../hooks/useFetchAPI";
import SuitescapeAPI from "../../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../../utilities/apiHelpers";
import capitalizedText from "../../utilities/textCapitalizer";

const initialState = {
  firstName: "",
  lastName: "",
  birthday: "",
  email: "",
  address: "",
  zipcode: "",
  city: "",
  region: "",
  nationality: "",
  gender: "",
  governmentId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const mappings = {
  firstName: "firstname",
  lastName: "lastname",
  birthday: "date_of_birth",
  email: "email",
  address: "address",
  zipcode: "zipcode",
  city: "city",
  region: "region",
  nationality: "nationality",
  gender: "gender",
  governmentId: "government_id",
};

const ManageAccount = () => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);
  const [errors, setErrors] = useState({});
  const [editingCount, setEditingCount] = useState(0);

  const { data: userData, isLoading } = useFetchAPI("/profile");
  const queryClient = useQueryClient();
  const toast = useToast();

  const setAccountData = (payload) => {
    dispatch({ type: "SET_DATA", payload });
  };

  useEffect(() => {
    if (userData) {
      Object.entries(mappings).forEach(([state, userDataKey]) => {
        if (!userData[userDataKey]) {
          return;
        }

        if (state === "birthday") {
          const formattedBirthday = format(
            new Date(userData[userDataKey]),
            "MM/dd/yyyy",
          );
          setAccountData({ birthday: formattedBirthday });
          return;
        }

        if (state === "gender") {
          const capitalizedGender = capitalizedText(userData[userDataKey]);
          setAccountData({ gender: capitalizedGender });
          return;
        }

        setAccountData({ [state]: userData[userDataKey] });
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
          console.log(res);

          toast.show(res.message, {
            type: res.updated ? "success" : "normal",
            placement: "bottom",
            style: toastStyles.toastInsetFooter,
          });

          if (res.updated) {
            queryClient
              .invalidateQueries({ queryKey: ["profile"] })
              .then(() => console.log("Profile info invalidated"));
          }
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
        handleErrors: (e) => {
          setErrors(e.errors);
        },
      }),
  });

  const updateProfile = () => {
    // Convert bookingState to backend format
    const profileData = Object.entries(mappings).reduce(
      (acc, [stateKey, userDataKey]) => {
        if (stateKey === "gender") {
          acc[userDataKey] = state[stateKey].toLowerCase();
          return acc;
        }

        acc[userDataKey] = state[stateKey];
        return acc;
      },
      {}, // acc - initial value
    );

    if (!updateProfileMutation.isPending) {
      updateProfileMutation.mutate({ profileData });
    }
  };

  const clearErrorWhenNotEmpty = (value, key) => {
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
  };

  const onEditPressed = () => {
    setEditingCount((prev) => prev + 1);
  };

  const onEditDone = () => {
    setEditingCount((prev) => prev - 1);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingBottom: StatusBar.currentHeight + 5,
          }}
        >
          <View
            style={{ alignItems: "center", paddingTop: 15, paddingBottom: 25 }}
          >
            <View>
              <Pressable>
                {({ pressed }) => (
                  <ProfileImage
                    size={120}
                    containerStyle={{ ...pressedOpacity(pressed) }}
                  />
                )}
              </Pressable>
              <Pressable
                style={({ pressed }) => ({
                  position: "absolute",
                  backgroundColor: Colors.black,
                  height: 30,
                  width: 30,
                  borderRadius: 50,
                  bottom: 0,
                  right: 10,
                  borderWidth: 1,
                  borderColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  ...pressedBgColor(pressed, Colors.gray),
                })}
              >
                <Ionicons
                  name="add"
                  size={25}
                  color="white"
                  style={{
                    alignSelf: "center",
                    left: 1,
                  }}
                />
              </Pressable>
            </View>
          </View>

          <View style={{ rowGap: 5 }}>
            <FormInput
              type="editable"
              value={state.firstName}
              onChangeText={(value) => {
                setAccountData({ firstName: value });
                clearErrorWhenNotEmpty(value, mappings.firstName);
              }}
              placeholder="First Name"
              errorMessage={errors?.firstname}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.lastName}
              onChangeText={(value) => {
                setAccountData({ lastName: value });
                clearErrorWhenNotEmpty(value, mappings.lastName);
              }}
              placeholder="Last Name"
              errorMessage={errors?.lastname}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />

            <FormInput
              type="editable"
              value={state.birthday}
              onChangeText={(value) => {
                setAccountData({ birthday: value });
                clearErrorWhenNotEmpty(value, mappings.birthday);
              }}
              // onDateConfirm={(_, text) => {
              //   setAccountData({ birthday: text });
              // }}
              placeholder="Birthday"
              errorMessage={errors?.date_of_birth}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.email}
              onChangeText={(value) => {
                setAccountData({ email: value });
                clearErrorWhenNotEmpty(value, mappings.email);
              }}
              placeholder="Email"
              errorMessage={errors?.email}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.address}
              onChangeText={(value) => {
                setAccountData({ address: value });
                clearErrorWhenNotEmpty(value, mappings.address);
              }}
              placeholder="Address"
              errorMessage={errors?.address}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.zipcode}
              onChangeText={(value) => {
                setAccountData({ zipcode: value });
                clearErrorWhenNotEmpty(value, mappings.zipcode);
              }}
              placeholder="Zip code"
              errorMessage={errors?.zipcode}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.city}
              onChangeText={(value) => {
                setAccountData({ city: value });
                clearErrorWhenNotEmpty(value, mappings.city);
              }}
              placeholder="City"
              errorMessage={errors?.city}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.region}
              onChangeText={(value) => {
                setAccountData({ region: value });
                clearErrorWhenNotEmpty(value, mappings.region);
              }}
              placeholder="Region"
              errorMessage={errors?.region}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.gender}
              onChangeText={(value) => {
                setAccountData({ gender: value });
                clearErrorWhenNotEmpty(value, mappings.gender);
              }}
              placeholder="Gender"
              errorMessage={errors?.gender}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.nationality}
              onChangeText={(value) => {
                setAccountData({ nationality: value });
                clearErrorWhenNotEmpty(value, mappings.nationality);
              }}
              placeholder="Nationality"
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.governmentId}
              onChangeText={(value) => {
                setAccountData({ governmentId: value });
                clearErrorWhenNotEmpty(value, mappings.governmentId);
              }}
              placeholder="Government ID"
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppFooter>
        <ButtonLarge disabled={editingCount > 0} onPress={updateProfile}>
          Save Changes
        </ButtonLarge>
      </AppFooter>
      <DialogLoading visible={isLoading} />
    </>
  );
};

export default ManageAccount;
