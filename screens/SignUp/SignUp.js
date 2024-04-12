import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "../../assets/styles/registrationStyles";
import AgreementBox from "../../components/AgreementBox/AgreementBox";
import AuthSwitchPrompt from "../../components/AuthSwitchPrompt/AuthSwitchPrompt";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import ButtonSocialLogin from "../../components/ButtonSocialLogin/ButtonSocialLogin";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FormInput from "../../components/FormInput/FormInput";
import HeaderText from "../../components/HeaderText/HeaderText";
import LineView from "../../components/LineView/LineView";
import LogoView from "../../components/LogoView/LogoView";
import PasswordCheckerView from "../../components/PasswordCheckerView/PasswordCheckerView";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import mappingsData from "../../data/mappingsData";
import clearErrorWhenNotEmpty from "../../utils/clearEmptyInput";
import convertDateFormat from "../../utils/dateConverter";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const birthdayRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const scrollViewRef = useRef(null);

  const insets = useSafeAreaInsets();
  const { authState, signUp, enableGuestMode } = useAuth();
  const { modifySetting } = useSettings();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Reset inputs and errors on screen blur
        setFirstName("");
        setLastName("");
        setBirthday("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsPasswordValid(false);
        setChecked(false);
        setErrors({});
      };
    }, []),
  );

  const isBirthdayValid = useCallback((dateFormatResult) => {
    if (!dateFormatResult) {
      return false;
    }

    const today = new Date();
    const birthday = new Date(convertDateFormat(dateFormatResult));

    // Check if user is in legal age
    const eighteenthBirthday = new Date(birthday);
    eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + 18);
    if (eighteenthBirthday > today) {
      Alert.alert("You must be 18 years old or above to register.");
      setBirthday("");
      return false;
    }

    return true;
  }, []);

  const handleSignUp = useCallback(() => {
    signUp(
      {
        firstName,
        lastName,
        birthday,
        email,
        password,
        confirmPassword,
      },
      navigation,
    ).catch((errors) => setErrors(errors));
  }, [
    firstName,
    lastName,
    birthday,
    email,
    password,
    confirmPassword,
    navigation,
  ]);

  const handleSkipButtonClick = useCallback(() => {
    modifySetting("onboardingEnabled", false);
    enableGuestMode().catch((err) => console.log(err));
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ paddingTop: insets.top }}
    >
      <StatusBar animated />
      <ScrollView
        ref={scrollViewRef}
        bounces={false}
        contentInset={{ bottom: insets.bottom + 15 }}
      >
        <ButtonLink
          onPress={handleSkipButtonClick}
          containerStyle={style.skipButtonContainer}
          textStyle={style.skipButtonText}
        >
          Skip
        </ButtonLink>
        <LogoView />
        <HeaderText>Create Account</HeaderText>
        <View style={style.inputContainer}>
          <FormInput
            value={firstName}
            onChangeText={(value) => {
              setFirstName(value);
              clearErrorWhenNotEmpty(value, mappingsData.firstName, setErrors);
            }}
            placeholder="First Name"
            textContentType="givenName"
            autoCapitalize="words"
            autoCorrect={false}
            errorMessage={errors?.[mappingsData.firstName]}
            returnKeyType="next"
            onSubmitEditing={() => {
              lastNameRef.current.focus();
            }}
            blurOnSubmit={false}
            ref={firstNameRef}
          />
          <FormInput
            value={lastName}
            onChangeText={(value) => {
              setLastName(value);
              clearErrorWhenNotEmpty(value, mappingsData.lastName, setErrors);
            }}
            placeholder="Last Name"
            textContentType="familyName"
            autoCapitalize="words"
            autoCorrect={false}
            errorMessage={errors?.[mappingsData.lastName]}
            returnKeyType="next"
            onSubmitEditing={() => {
              birthdayRef.current.focus();
            }}
            blurOnSubmit={false}
            ref={lastNameRef}
          />
          <FormInput
            type="date"
            value={birthday}
            onChangeText={(value) => {
              setBirthday(value);
              clearErrorWhenNotEmpty(value, mappingsData.birthday, setErrors);
            }}
            onDateConfirm={(_, text) => {
              if (isBirthdayValid(text)) {
                setBirthday(text);
              }
            }}
            dateProps={{ maximumDate: new Date() }}
            placeholder="Birthday (MM/DD/YYYY)"
            textContentType="none"
            keyboardType="number-pad"
            autoCorrect={false}
            spellCheck={false}
            errorMessage={errors?.[mappingsData.birthday]}
            returnKeyType="next"
            onBlur={() => isBirthdayValid(birthday)}
            onSubmitEditing={() => {
              emailRef.current.focus();
            }}
            blurOnSubmit={false}
            ref={birthdayRef}
          />
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
            autoCapitalize="none"
            autoCorrect={false}
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
            textContentType="password"
            passwordRules="minlength: 20; required: lower; required: upper; required: digit; required: [-];"
            errorMessage={errors?.[mappingsData.password]}
            returnKeyType="next"
            isPasswordVisible={isPasswordVisible}
            onChangePasswordVisibility={() =>
              setIsPasswordVisible((prev) => !prev)
            }
            onSubmitEditing={() => {
              confirmPasswordRef.current.focus();
            }}
            blurOnSubmit={false}
            ref={passwordRef}
          />
          <FormInput
            type="password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearErrorWhenNotEmpty(value, mappingsData.password, setErrors);
            }}
            errorMessage={errors?.[mappingsData.password] && []}
            placeholder="Confirm Password"
            textContentType="password"
            returnKeyType="done"
            isPasswordVisible={isPasswordVisible}
            onChangePasswordVisibility={() =>
              setIsPasswordVisible((prev) => !prev)
            }
            ref={confirmPasswordRef}
          />
        </View>
        <View style={style.passwordCheckerContainer}>
          {password.length > 0 && (
            <PasswordCheckerView
              password={password}
              setIsPasswordValid={setIsPasswordValid}
              onLayout={() => {
                scrollViewRef.current.scrollTo({
                  y: 200,
                  animated: true,
                });
              }}
            />
          )}
        </View>
        <AgreementBox checked={checked} setChecked={setChecked} />
        <View style={style.buttonContainer}>
          <ButtonLarge
            disabled={!checked || !isPasswordValid}
            onPress={handleSignUp}
          >
            Sign Up
          </ButtonLarge>
        </View>
        <LineView>Or</LineView>
        <ButtonSocialLogin type="phone" />
        <ButtonSocialLogin type="facebook" />
        <ButtonSocialLogin type="google" />
        <AuthSwitchPrompt />
      </ScrollView>

      <DialogLoading
        visible={authState.isLoading}
        title="Signing up..."
        // onCancel={() => abort()}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUp;
