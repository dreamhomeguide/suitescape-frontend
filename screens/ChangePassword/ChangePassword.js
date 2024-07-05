import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

import style from "./ChangePasswordStyles";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import FormInput from "../../components/FormInput/FormInput";
import PasswordCheckerView from "../../components/PasswordCheckerView/PasswordCheckerView";
import { Routes } from "../../navigation/Routes";
import { changePassword } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const toast = useToast();

  const handleSuccessChangePassword = useCallback(
    (response) =>
      handleApiResponse({
        response,
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
    [navigation, toast],
  );

  const handleErrorChangePassword = useCallback(
    (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
        handleErrors: (e) => setErrors(e.errors),
      }),
    [],
  );

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: handleSuccessChangePassword,
    onError: handleErrorChangePassword,
  });

  const handleChangePassword = useCallback(() => {
    if (!changePasswordMutation.isPending) {
      changePasswordMutation.mutate({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmNewPassword,
      });
    }
  }, [
    currentPassword,
    newPassword,
    confirmNewPassword,
    changePasswordMutation.isPending,
  ]);

  return (
    <View style={globalStyles.flexFull}>
      <ScrollView bounces={false} contentContainerStyle={style.mainContainer}>
        <FormInput
          type="password"
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          errorMessage={errors?.current_password}
          onChangeText={(value) => {
            setCurrentPassword(value);
            clearErrorWhenNotEmpty(value, "current_password", setErrors);
          }}
          onSubmitEditing={() => newPasswordRef.current.focus()}
          blurOnSubmit={false}
        />
        <View style={style.forgotPasswordContainer}>
          <ButtonLink
            onPress={() => navigation.navigate(Routes.FORGOT_PASSWORD)}
            textStyle={style.forgotPasswordText}
          >
            Forgot Password?
          </ButtonLink>
        </View>

        <FormInput
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          errorMessage={errors?.new_password}
          onChangeText={(value) => {
            setNewPassword(value);
            clearErrorWhenNotEmpty(value, "new_password", setErrors);
          }}
          isPasswordVisible={isPasswordVisible}
          onChangePasswordVisibility={() =>
            setIsPasswordVisible((prev) => !prev)
          }
          onSubmitEditing={() => confirmNewPasswordRef.current.focus()}
          blurOnSubmit={false}
          returnKeyType="next"
          ref={newPasswordRef}
        />
        <FormInput
          type="password"
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          errorMessage={errors?.new_password && []}
          onChangeText={(value) => {
            setConfirmNewPassword(value);
            clearErrorWhenNotEmpty(value, "new_password", setErrors);
          }}
          isPasswordVisible={isPasswordVisible}
          onChangePasswordVisibility={() =>
            setIsPasswordVisible((prev) => !prev)
          }
          returnKeyType="done"
          ref={confirmNewPasswordRef}
        />
        <View style={style.passwordCheckerContainer}>
          {newPassword.length > 0 && (
            <PasswordCheckerView password={newPassword} />
          )}
        </View>
      </ScrollView>

      <AppFooter>
        <ButtonLarge onPress={handleChangePassword}>
          Change Password
        </ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default ChangePassword;
