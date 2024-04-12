import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/forgotPasswordStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import OTPBoxes from "../../components/OTPBoxes/OTPBoxes";
import { Routes } from "../../navigation/Routes";
import { sendResetCode, validateCode } from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";

// 5 minutes
const WAIT_TIME = 300000;

const EmailVerification = ({ navigation, route }) => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(new Date().setTime(WAIT_TIME));
  const [isWrongCode, setIsWrongCode] = useState(false);

  const boxesRef = useRef(null);
  const intervalRef = useRef(null);

  const email = route.params.email;

  const validateCodeMutation = useMutation({
    mutationFn: validateCode,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: () => {
          navigation.replace(Routes.RESET_PASSWORD, { email, code });
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        handleErrors: () => {
          setIsWrongCode(true);
          boxesRef.current.clear();
        },
        defaultAlert: true,
        defaultAlertTitle: "Invalid Code",
      }),
  });

  const resendCodeMutation = useMutation({
    mutationFn: sendResetCode,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: (res) => {
          Alert.alert("Check your email", res.message);
          setTimer(new Date().setTime(WAIT_TIME));
          setIsWrongCode(false);
          boxesRef.current.clear();
        },
      }),
    onError: (err) =>
      handleApiError({
        error: err,
        defaultAlert: true,
      }),
  });

  const handleVerify = useCallback(
    (newCode) => {
      if (!validateCodeMutation.isPending) {
        validateCodeMutation.mutate({ email, code: newCode ?? code });
      }
    },
    [validateCodeMutation.isPending, email, code],
  );

  const handleResend = useCallback(() => {
    // if (timer > 0) {
    //   Alert.alert("Please wait", "You can resend a new code after 1 minute.");
    //   return;
    // }

    if (!resendCodeMutation.isPending) {
      resendCodeMutation.mutate({ email });
    }
  }, [resendCodeMutation.isPending, email]);

  useEffect(() => {
    // Do not reset timer if resend code mutation is still pending or there is an error
    if (resendCodeMutation.isPending && !resendCodeMutation.isError) {
      return;
    }

    // Clear interval if there is one
    clearInterval(intervalRef.current);

    // Start interval
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1000;
        } else if (prevTimer === 0) {
          // Alert.alert(
          //   "Resend code",
          //   "Your code has expired. Do you want to resend a new code?",
          //   [
          //     {
          //       text: "No",
          //       style: "cancel",
          //       onPress: () => navigation.navigate(Routes.FORGOT_PASSWORD),
          //     },
          //     {
          //       text: "Yes",
          //       onPress: handleResend,
          //     },
          //   ],
          // );

          clearInterval(intervalRef.current);
          return prevTimer;
        }
      });
    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(intervalRef.current);
  }, [resendCodeMutation.isPending, resendCodeMutation.isError]);

  return (
    <>
      <ScrollView scrollEnabled={false}>
        <View style={style.mainContainer}>
          <View style={style.contentContainer}>
            <Text style={style.text}>Verification code has been sent to:</Text>
            <Text style={globalStyles.headerText}>{email}</Text>
          </View>

          <View>
            <OTPBoxes
              ref={boxesRef}
              onOTPChange={(OTP) => {
                setCode(OTP);
                if (isWrongCode) {
                  setIsWrongCode(false);
                }
              }}
              isInvalid={isWrongCode}
              onFinish={handleVerify}
            />

            <View style={style.otpContentContainer}>
              {isWrongCode && (
                <View style={style.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={Colors.red} />
                  <Text style={{ color: Colors.red }}>
                    Wrong code. Try again.
                  </Text>
                </View>
              )}
              <Text style={style.timer}>{format(timer, "m:ss")}</Text>
            </View>
          </View>

          <View style={style.buttonContainer}>
            <ButtonLarge onPress={handleVerify}>Verify</ButtonLarge>
          </View>

          <View style={style.resendContainer}>
            <Text style={style.resendText}>Didn't get a code?</Text>
            <ButtonLink onPress={handleResend} textStyle={style.resendText}>
              Resend
            </ButtonLink>
          </View>
        </View>
      </ScrollView>

      <DialogLoading
        visible={validateCodeMutation.isPending}
        title="Verifying..."
      />

      <DialogLoading
        visible={resendCodeMutation.isPending}
        title="Resending code..."
      />
    </>
  );
};

export default EmailVerification;
