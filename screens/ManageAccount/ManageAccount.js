import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import style from "./ManageAccountStyles";
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
import SliderModalPhoto from "../../components/SliderModalPhoto/SliderModalPhoto";
import mappingsData from "../../data/mappingsData";
import useProfilePicture from "../../hooks/useProfilePicture";
import { baseURL } from "../../services/SuitescapeAPI";
import { fetchProfile, updateProfile } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";
import capitalizedText from "../../utils/textCapitalizer";

const initialState = {
  firstName: "",
  lastName: "",
  birthday: "",
  email: "",
  address: "",
  zipcode: "",
  city: "",
  region: "",
  mobileNumber: "",
  gender: "",
  nationality: "",
  governmentId: "",
  image: null,
  isImageSelected: false,
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

const ManageAccount = () => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);
  const [errors, setErrors] = useState({});
  const [editingCount, setEditingCount] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const queryClient = useQueryClient();
  const toast = useToast();
  const profilePicture = useProfilePicture();

  const setAccountData = useCallback((payload) => {
    dispatch({ type: "SET_DATA", payload });
  }, []);

  const modalPicture = useMemo(
    () => [state.image ?? profilePicture],
    [state.image, profilePicture],
  );

  const { data: userData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (userData) {
      Object.entries(mappingsData).forEach(([state, userDataKey]) => {
        if (!userData[userDataKey]) {
          return;
        }

        if (state === "imageUrl") {
          setAccountData({
            image: { uri: baseURL + userData[userDataKey] },
            isImageSelected: false,
          });
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

  const handleSuccessUpdateProfile = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onError: (e) => {
          setErrors(e.errors);
        },
        onSuccess: async (res) => {
          console.log(res);

          toast.show(res.message, {
            type: res.updated ? "success" : "normal",
            placement: "bottom",
            style: toastStyles.toastInsetFooter,
          });

          if (res.updated) {
            // Invalidate profile info query
            await queryClient.invalidateQueries({ queryKey: ["profile"] });
            console.log("Profile info invalidated");
          }
        },
      }),
    [queryClient, toast],
  );

  const handleErrorUpdateProfile = useCallback(
    (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
        handleErrors: (e) => {
          setErrors(e.errors);
        },
      }),
    [],
  );

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: handleSuccessUpdateProfile,
    onError: handleErrorUpdateProfile,
  });

  const handleUpdateProfile = useCallback(() => {
    // Create a new FormData instance
    const formData = new FormData();

    // Convert bookingState to backend format
    const profileData = Object.entries(mappingsData).reduce(
      (acc, [stateKey, userDataKey]) => {
        if (stateKey === "imageUrl") {
          return acc;
        }

        if (stateKey === "gender") {
          acc.append(userDataKey, state[stateKey].toLowerCase());
          return acc;
        }

        if (stateKey === "image") {
          if (!state.isImageSelected || !state[stateKey]?.uri) {
            return acc;
          }
          acc.append(userDataKey, {
            uri: state[stateKey].uri,
            name: "profile.jpg",
            type: "image/jpg",
          });
          return acc;
        }

        acc.append(userDataKey, state[stateKey]);
        return acc;
      },
      formData, // initial value for acc
    );

    if (!updateProfileMutation.isPending) {
      updateProfileMutation.mutate({ profileData });
    }
  }, [state, updateProfileMutation.isPending]);

  const onEditPressed = useCallback(() => {
    setEditingCount((prev) => prev + 1);
  }, []);

  const onEditDone = useCallback(() => {
    setEditingCount((prev) => prev - 1);
  }, []);

  const enableImageModal = useCallback(() => {
    setShowImageModal(true);
  }, []);

  const disableImageModal = useCallback(() => {
    setShowImageModal(false);
  }, []);

  const removeProfileImage = useCallback(() => {
    setAccountData({
      image: profilePicture.uri ?? profilePicture,
      isImageSelected: false,
    });
  }, [profilePicture]);

  const pickProfileImage = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAccountData({
        image: { uri: result.assets[0].uri },
        isImageSelected: true,
      });
    }
  }, [state.image]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        onLayout={() => {
          if (Platform.OS === "android") {
            setIsFooterVisible(!Keyboard.isVisible());
          }
        }}
        style={globalStyles.flexFull}
      >
        <ScrollView
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={style.mainContainer}
        >
          <View style={style.profileImageContainer}>
            <View>
              <Pressable
                onPress={enableImageModal}
                style={({ pressed }) => pressedOpacity(pressed)}
              >
                <ProfileImage
                  size={120}
                  source={state.image ?? profilePicture}
                />
              </Pressable>
              <Pressable
                onPress={
                  state.isImageSelected ? removeProfileImage : pickProfileImage
                }
                style={({ pressed }) => ({
                  ...style.addButtonContainer,
                  backgroundColor: state.isImageSelected
                    ? Colors.red
                    : Colors.black,
                  ...pressedBgColor(pressed, Colors.gray),
                })}
              >
                <Ionicons
                  name={state.isImageSelected ? "close" : "add"}
                  size={25}
                  color="white"
                  style={style.addButton}
                />
              </Pressable>
            </View>
          </View>

          <View style={style.contentContainer}>
            <FormInput
              type="editable"
              value={state.firstName}
              onChangeText={(value) => {
                setAccountData({ firstName: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.firstName,
                  setErrors,
                );
              }}
              placeholder="First Name"
              errorMessage={errors?.[mappingsData.firstName]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.lastName}
              onChangeText={(value) => {
                setAccountData({ lastName: value });
                clearErrorWhenNotEmpty(value, mappingsData.lastName, setErrors);
              }}
              placeholder="Last Name"
              errorMessage={errors?.[mappingsData.lastName]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />

            <FormInput
              type="editable"
              value={state.birthday}
              onChangeText={(value) => {
                setAccountData({ birthday: value });
                clearErrorWhenNotEmpty(value, mappingsData.birthday, setErrors);
              }}
              // onDateConfirm={(_, text) => {
              //   setAccountData({ birthday: text });
              // }}
              placeholder="Birthday"
              errorMessage={errors?.[mappingsData.birthday]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.email}
              onChangeText={(value) => {
                setAccountData({ email: value });
                clearErrorWhenNotEmpty(value, mappingsData.email, setErrors);
              }}
              placeholder="Email"
              errorMessage={errors?.[mappingsData.email]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.address}
              onChangeText={(value) => {
                setAccountData({ address: value });
                clearErrorWhenNotEmpty(value, mappingsData.address, setErrors);
              }}
              placeholder="Address"
              errorMessage={errors?.[mappingsData.address]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.zipcode}
              onChangeText={(value) => {
                setAccountData({ zipcode: value });
                clearErrorWhenNotEmpty(value, mappingsData.zipcode, setErrors);
              }}
              placeholder="Zip code"
              errorMessage={errors?.[mappingsData.zipcode]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.city}
              onChangeText={(value) => {
                setAccountData({ city: value });
                clearErrorWhenNotEmpty(value, mappingsData.city, setErrors);
              }}
              placeholder="City"
              errorMessage={errors?.[mappingsData.city]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.region}
              onChangeText={(value) => {
                setAccountData({ region: value });
                clearErrorWhenNotEmpty(value, mappingsData.region, setErrors);
              }}
              placeholder="Region"
              errorMessage={errors?.[mappingsData.region]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.mobileNumber}
              onChangeText={(value) => {
                setAccountData({ mobileNumber: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.mobileNumber,
                  setErrors,
                );
              }}
              placeholder="Mobile Number"
              errorMessage={errors?.[mappingsData.mobileNumber]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.gender}
              onChangeText={(value) => {
                setAccountData({ gender: value });
                clearErrorWhenNotEmpty(value, mappingsData.gender, setErrors);
              }}
              placeholder="Gender"
              errorMessage={errors?.[mappingsData.gender]}
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
            <FormInput
              type="editable"
              value={state.nationality}
              onChangeText={(value) => {
                setAccountData({ nationality: value });
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.nationality,
                  setErrors,
                );
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
                clearErrorWhenNotEmpty(
                  value,
                  mappingsData.governmentId,
                  setErrors,
                );
              }}
              placeholder="Government ID"
              onEditPressed={onEditPressed}
              onEditDone={onEditDone}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SliderModalPhoto
        imageData={modalPicture}
        visible={showImageModal}
        onClose={disableImageModal}
        showIndex={false}
      />

      {isFooterVisible && (
        <AppFooter>
          <ButtonLarge
            disabled={editingCount > 0}
            onPress={handleUpdateProfile}
          >
            Save Changes
          </ButtonLarge>
        </AppFooter>
      )}

      <DialogLoading visible={isLoading || updateProfileMutation.isPending} />
    </>
  );
};

export default ManageAccount;
