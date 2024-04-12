import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import style from "../../assets/styles/forgotPasswordStyles";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import PasswordCheckerView from "../../components/PasswordCheckerView/PasswordCheckerView";
import mappingsData from "../../data/mappingsData";
import { Routes } from "../../navigation/Routes";
import { resetPassword } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";

const ResetPassword = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const confirmPasswordRef = useRef(null);

  const { email, code } = route.params;

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: (res) => {
          console.log(res);

          navigation.navigate(Routes.FEEDBACK, {
            type: "success",
            title: "Congratulations",
            subtitle: "Your password has been reset.",
          });
        },
      }),
    onError: (err) =>
      handleApiError({
        handleErrors: (e) => setErrors(e.errors),
        error: err,
        defaultAlert: true,
      }),
  });

  const handleResetPassword = useCallback(() => {
    if (!resetPasswordMutation.isPending) {
      resetPasswordMutation.mutate({
        email,
        code,
        newPassword,
        newPasswordConfirmation: confirmPassword,
      });
    }
  }, [
    email,
    code,
    newPassword,
    confirmPassword,
    resetPasswordMutation.isPending,
  ]);

  return (
    <>
      <ScrollView scrollEnabled={false}>
        <View style={style.mainContainer}>
          <View style={style.contentContainer}>
            <Text style={style.text}>Set your new Suitescape password.</Text>
          </View>
          <FormInput
            type="password"
            value={newPassword}
            onChangeText={(value) => {
              setNewPassword(value);
              clearErrorWhenNotEmpty(
                value,
                mappingsData.newPassword,
                setErrors,
              );
            }}
            isPasswordVisible={isPasswordVisible}
            onChangePasswordVisibility={() =>
              setIsPasswordVisible((prev) => !prev)
            }
            errorMessage={errors?.new_password}
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            blurOnSubmit={false}
            placeholder="New Password"
          />
          <FormInput
            type="password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearErrorWhenNotEmpty(
                value,
                mappingsData.newPassword,
                setErrors,
              );
            }}
            isPasswordVisible={isPasswordVisible}
            onChangePasswordVisibility={() =>
              setIsPasswordVisible((prev) => !prev)
            }
            errorMessage={errors?.new_password && []}
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          {newPassword.length > 0 && (
            <PasswordCheckerView password={newPassword} />
          )}
          <View style={style.buttonContainer}>
            <ButtonLarge onPress={handleResetPassword}>
              Reset Password
            </ButtonLarge>
          </View>
        </View>
      </ScrollView>

      <DialogLoading
        visible={resetPasswordMutation.isPending}
        title="Resetting Password..."
      />
    </>
  );
};

export default ResetPassword;
