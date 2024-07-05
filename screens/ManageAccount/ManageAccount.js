import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
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
import reducerSetter from "../../utils/reducerSetter";
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
  profileImage: null,
  coverImage: null,
  isProfileImageSelected: false,
  isCoverImageSelected: false,
};

const ManageAccount = () => {
  const [state, setAccountData] = useReducer(
    reducerSetter,
    initialState,
    undefined,
  );
  const [errors, setErrors] = useState({});
  const [editingCount, setEditingCount] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  const [isImageModalShown, setIsImageModalShown] = useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();
  const profilePicture = useProfilePicture();

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

        if (state === "profileImageUrl") {
          setAccountData({
            profileImage: { uri: baseURL + userData[userDataKey] },
            isProfileImageSelected: false,
          });
          return;
        }

        if (state === "coverImageUrl") {
          setAccountData({
            coverImage: { uri: baseURL + userData[userDataKey] },
            isCoverImageSelected: false,
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

            // Invalidate host info query
            await queryClient.invalidateQueries({
              queryKey: ["hosts", userData.id],
            });
          }
        },
      }),
    [queryClient, toast, userData?.id],
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
        if (stateKey === "profileImageUrl") {
          return acc;
        }

        if (stateKey === "coverImageUrl") {
          return acc;
        }

        if (stateKey === "gender") {
          acc.append(userDataKey, state[stateKey].toLowerCase());
          return acc;
        }

        if (stateKey === "profileImage") {
          // Check if the profile image is selected and has an uri
          if (!state.isProfileImageSelected || !state[stateKey]?.uri) {
            return acc;
          }

          acc.append(userDataKey, {
            uri: state[stateKey].uri,
            name: "profileImage.jpg",
            type: "image/jpg",
          });
          return acc;
        }

        if (stateKey === "coverImage") {
          // Check if the cover image is selected and has an uri
          if (!state.isCoverImageSelected || !state[stateKey]?.uri) {
            return acc;
          }
          acc.append(userDataKey, {
            uri: state[stateKey].uri,
            name: "coverImage.jpg",
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

  const showProfileImage = useCallback(() => {
    setModalImage(state.profileImage ?? profilePicture);
    setIsImageModalShown(true);
  }, [profilePicture, state.profileImage]);

  const showCoverImage = useCallback(() => {
    setModalImage(state.coverImage);
    setIsImageModalShown(true);
  }, [state.coverImage]);

  const hideImageModal = useCallback(() => {
    setIsImageModalShown(false);
  }, []);

  const resetProfileImage = useCallback(() => {
    setAccountData({
      profileImage: userData.profile_image_url
        ? baseURL + userData.profile_image_url
        : profilePicture,
      isProfileImageSelected: false,
    });
  }, [userData?.profile_image_url]);

  const resetCoverImage = useCallback(() => {
    setAccountData({
      coverImage: userData.cover_image_url
        ? baseURL + userData.cover_image_url
        : null,
      isCoverImageSelected: false,
    });
  }, [userData?.cover_image_url]);

  const pickProfileImage = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAccountData({
        profileImage: { uri: result.assets[0].uri },
        isProfileImageSelected: true,
      });
    }
  }, []);

  const pickCoverImage = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAccountData({
        coverImage: { uri: result.assets[0].uri },
        isCoverImageSelected: true,
      });
    }
  }, []);

  const onCoverImagePress = useCallback(async () => {
    if (!state.coverImage) {
      await pickCoverImage();
      return;
    }

    Alert.alert("Cover Image", "What do you want to do?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "View",
        onPress: showCoverImage,
      },
      {
        text: "Change",
        onPress: pickCoverImage,
      },
      {
        text: "Reset",
        onPress: resetCoverImage,
      },
    ]);
  }, [pickCoverImage, resetCoverImage, showCoverImage, state.coverImage]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={80}
        style={globalStyles.flexFull}
      >
        <ScrollView
          contentInset={{ top: 10, bottom: 35 }}
          contentContainerStyle={style.mainContainer}
        >
          <View style={style.imagesContainer}>
            <View style={globalStyles.containerGap}>
              <Text style={style.labelCenter}>Profile Image</Text>

              <Pressable
                onPress={showProfileImage}
                style={({ pressed }) => pressedOpacity(pressed)}
              >
                <ProfileImage
                  size={120}
                  source={state.profileImage ?? profilePicture}
                />
              </Pressable>

              <Pressable
                onPress={
                  state.isProfileImageSelected
                    ? resetProfileImage
                    : pickProfileImage
                }
                style={({ pressed }) => ({
                  ...style.addButtonContainer,
                  backgroundColor: state.isProfileImageSelected
                    ? Colors.red
                    : Colors.black,
                  ...pressedBgColor(pressed, Colors.gray),
                })}
              >
                <Ionicons
                  name={state.isProfileImageSelected ? "close" : "add"}
                  size={25}
                  color="white"
                  style={style.addButton}
                />
              </Pressable>
            </View>

            <View style={style.coverImageContainer}>
              <Text style={style.label}>Cover Image</Text>

              <Pressable
                onPress={onCoverImagePress}
                style={({ pressed }) => ({
                  ...style.coverImage,
                  ...pressedOpacity(pressed),
                })}
              >
                {state.coverImage ? (
                  <Image
                    source={state.coverImage}
                    style={globalStyles.flexFull}
                    contentFit="cover"
                  />
                ) : (
                  <View style={style.addCoverImageContainer}>
                    <Ionicons name="add" size={25} color="black" />
                    <Text>Add Cover Image</Text>
                  </View>
                )}
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
        imageData={[modalImage]} // Wrap the image in an array
        visible={isImageModalShown}
        onClose={hideImageModal}
        showIndex={false}
      />

      <AppFooter>
        <ButtonLarge disabled={editingCount > 0} onPress={handleUpdateProfile}>
          Save Changes
        </ButtonLarge>
      </AppFooter>

      <DialogLoading visible={isLoading || updateProfileMutation.isPending} />
    </>
  );
};

export default ManageAccount;
