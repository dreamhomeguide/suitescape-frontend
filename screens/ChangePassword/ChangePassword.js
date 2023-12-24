import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/registrationStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import FormInput from "../../components/FormInput/FormInput";
import SuitescapeAPI from "../../services/SuitescapeAPI";
import { handleApiError, handleApiResponse } from "../../utilities/apiHelpers";

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});

  const confirmPasswordRef = useRef(null);

  const toast = useToast();

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      SuitescapeAPI.post("/profile/update-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      }),
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onError: (e) => {
          setErrors(e);
        },
        onSuccess: (res) => {
          console.log(res);

          toast.show(res.message, {
            type: "success",
            placement: "bottom",
            style: toastStyles.toastInsetFooter,
          });

          navigation.goBack();
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

  const changePassword = () => {
    if (!changePasswordMutation.isPending) {
      changePasswordMutation.mutate();
    }
  };

  const clearErrorWhenNotEmpty = (value, key) => {
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
  };

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{ marginHorizontal: 15, paddingVertical: 10 }}
      >
        <FormInput
          type="password"
          label="Current Password"
          value={currentPassword}
          errorMessage={errors?.current_password}
          onChangeText={(value) => {
            setCurrentPassword(value);
            clearErrorWhenNotEmpty(value, "current_password");
          }}
        />
        <View
          style={{ alignItems: "flex-end", marginTop: 5, marginHorizontal: 5 }}
        >
          <ButtonLink
            onPress={() => console.log("Forgot Password")}
            textStyle={style.forgotPasswordText}
          >
            Forgot Password?
          </ButtonLink>
        </View>

        <FormInput
          type="password"
          label="New Password"
          value={newPassword}
          errorMessage={errors?.new_password}
          onChangeText={(value) => {
            setNewPassword(value);
            clearErrorWhenNotEmpty(value, "new_password");
          }}
          onSubmitEditing={() => {
            confirmPasswordRef.current.focus();
          }}
          blurOnSubmit={false}
          returnKeyType="next"
        />
        <FormInput
          type="password"
          label="Confirm New Password"
          value={confirmNewPassword}
          errorMessage={errors?.new_password && []}
          onChangeText={(value) => {
            setConfirmNewPassword(value);
            clearErrorWhenNotEmpty(value, "new_password");
          }}
          returnKeyType="done"
          ref={confirmPasswordRef}
        />
      </ScrollView>
      <AppFooter>
        <ButtonLarge onPress={changePassword}>Change Password</ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default ChangePassword;
