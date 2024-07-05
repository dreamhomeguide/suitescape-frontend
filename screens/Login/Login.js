import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "../../assets/styles/registrationStyles";
import AuthSwitchPrompt from "../../components/AuthSwitchPrompt/AuthSwitchPrompt";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import ButtonSocialLogin from "../../components/ButtonSocialLogin/ButtonSocialLogin";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import HeaderText from "../../components/HeaderText/HeaderText";
import LineView from "../../components/LineView/LineView";
import LogoView from "../../components/LogoView/LogoView";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import mappingsData from "../../data/mappingsData";
import { Routes } from "../../navigation/Routes";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const insets = useSafeAreaInsets();
  const { authState, signIn, enableGuestMode } = useAuth();
  const { modifySetting } = useSettings();

  useEffect(() => {
    // Get last email logged in from SecureStore
    const lastEmail = SecureStore.getItem("lastEmailLoggedIn");

    if (lastEmail) {
      setEmail(lastEmail);

      // Remove email once its shown
      SecureStore.deleteItemAsync("lastEmailLoggedIn").then(() => {
        console.log("Last email logged in:", lastEmail);
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Reset inputs and errors on screen blur
        setEmail("");
        setPassword("");
        setErrors({});
      };
    }, []),
  );

  const handleSignIn = useCallback(() => {
    signIn({ email, password }).catch((errors) => setErrors(errors));
  }, [email, password]);

  const handleSkipButtonClick = useCallback(() => {
    modifySetting("onboardingEnabled", false);
    modifySetting("hostModeEnabled", false);
    enableGuestMode().catch((err) => console.log(err));
  }, []);

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar animated />
      <ButtonLink
        onPress={handleSkipButtonClick}
        containerStyle={style.skipButtonContainer}
        textStyle={style.skipButtonText}
      >
        Skip
      </ButtonLink>
      <LogoView />
      <HeaderText>Login</HeaderText>
      <View style={style.inputContainer}>
        <FormInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            clearErrorWhenNotEmpty(value, mappingsData.email, setErrors);
          }}
          placeholder="Email Address"
          // Bug: doesn't show cursor when this is on
          // keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          errorMessage={errors?.[mappingsData.email]}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
          blurOnSubmit={false}
          ref={emailRef}
        />
        <FormInput
          type="password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearErrorWhenNotEmpty(value, mappingsData.password, setErrors);
          }}
          placeholder="Password"
          textContentType="none"
          errorMessage={errors?.[mappingsData.password]}
          returnKeyType="done"
          ref={passwordRef}
        />
      </View>
      <View style={style.forgotPasswordButtonContainer}>
        <ButtonLink
          onPress={() => navigation.navigate(Routes.FORGOT_PASSWORD)}
          textStyle={style.forgotPasswordText}
        >
          Forgot Password?
        </ButtonLink>
      </View>
      <View style={style.buttonContainer}>
        <ButtonLarge onPress={handleSignIn}>Login</ButtonLarge>
      </View>
      <LineView>Or</LineView>
      <ButtonSocialLogin type="facebook" />
      <ButtonSocialLogin type="google" />
      <AuthSwitchPrompt isRegistration />

      <DialogLoading
        visible={authState.isLoading}
        title="Logging in..."
        // onCancel={() => abort()}
      />
    </ScrollView>
  );
};

export default Login;
