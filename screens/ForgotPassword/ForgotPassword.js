import { useMutation } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import style from "../../assets/styles/forgotPasswordStyles";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import { Routes } from "../../navigation/Routes";
import { sendResetCode } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: sendResetCode,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: (res) => {
          console.log(res);

          navigation.navigate(Routes.EMAIL_VERIFICATION, { email });
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const handleVerify = useCallback(() => {
    if (!forgotPasswordMutation.isPending) {
      forgotPasswordMutation.mutate({ email });
    }
  }, [forgotPasswordMutation.isPending, email]);

  return (
    <>
      <StatusBar style="light" animated />

      <ScrollView scrollEnabled={false}>
        <View style={style.mainContainer}>
          <View style={style.contentContainer}>
            <Text style={style.text}>
              Please enter your email address. We will send you a verification
              code.
            </Text>
          </View>
          <FormInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            autoCapitalize="none"
            onSubmitEditing={handleVerify}
          />
          <View style={style.buttonContainer}>
            <ButtonLarge onPress={handleVerify}>Verify</ButtonLarge>
          </View>
        </View>
      </ScrollView>

      <DialogLoading
        visible={forgotPasswordMutation.isPending}
        title="Sending verification code..."
      />
    </>
  );
};

export default ForgotPassword;
