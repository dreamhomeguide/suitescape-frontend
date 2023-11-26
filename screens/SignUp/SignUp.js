import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import registrationStyles from "../../assets/styles/registrationStyles";
import AgreementBox from "../../components/AgreementBox/AgreementBox";
import AuthSwitchPrompt from "../../components/AuthSwitchPrompt/AuthSwitchPrompt";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ButtonSocialLogin from "../../components/ButtonSocialLogin/ButtonSocialLogin";
import FormInput from "../../components/FormInput/FormInput";
import HeaderText from "../../components/HeaderText/HeaderText";
import LineView from "../../components/LineView/LineView";
import LoadingDialog from "../../components/LoadingDialog/LoadingDialog";
import LogoView from "../../components/LogoView/LogoView";
import PasswordCheckerView from "../../components/PasswordCheckerView/PasswordCheckerView";
import { useAuth } from "../../contexts/AuthContext";
import { Routes } from "../../navigation/Routes";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
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
  const { authState, signUp, abort } = useAuth();
  const { height } = useWindowDimensions();

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

  const clearErrorWhenNotEmpty = (value, key) => {
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
  };

  const handleBirthdayConfirm = (birthdate) => {
    if (!birthdate) {
      return;
    }

    const today = new Date();
    const eighteenthBirthday = new Date(birthdate);
    eighteenthBirthday.setFullYear(birthdate.getFullYear() + 18);

    if (eighteenthBirthday > today) {
      Alert.alert("You must be 18 years old or above to register.");
      setBirthday("");
      return false;
    }
  };

  const handleSignUp = () => {
    signUp({
      firstName,
      lastName,
      birthday,
      email,
      password,
      confirmPassword,
    })
      .then(() => {
        navigation.replace(Routes.FEEDBACK, {
          type: "success",
          title: "Congratulations",
          subtitle: "You account has been created.",
          screenToNavigate: Routes.LOGIN,
        });
      })
      .catch((errors) => setErrors(errors));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{
        paddingTop: insets.top,
      }}
    >
      <StatusBar animated />
      <ScrollView
        ref={scrollViewRef}
        bounces={false}
        contentInset={{ bottom: 15 }}
      >
        <LogoView />
        <HeaderText>Create Account</HeaderText>
        <FormInput
          value={firstName}
          onChangeText={(value) => {
            setFirstName(value);
            clearErrorWhenNotEmpty(value, "firstname");
          }}
          placeholder="First Name"
          textContentType="givenName"
          autoCapitalize="words"
          autoCorrect={false}
          errorMessage={errors?.firstname}
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
            clearErrorWhenNotEmpty(value, "lastname");
          }}
          placeholder="Last Name"
          textContentType="familyName"
          autoCapitalize="words"
          autoCorrect={false}
          errorMessage={errors?.lastname}
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
            clearErrorWhenNotEmpty(value, "date_of_birth");
          }}
          onDateConfirm={handleBirthdayConfirm}
          dateProps={{ maximumDate: new Date() }}
          placeholder="Birthday"
          textContentType="none"
          autoCorrect={false}
          spellCheck={false}
          errorMessage={errors?.date_of_birth}
          returnKeyType="next"
          onBlur={handleBirthdayConfirm}
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
            clearErrorWhenNotEmpty(value, "email");
          }}
          placeholder="Email Address"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={errors?.email}
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
            clearErrorWhenNotEmpty(value, "password");
          }}
          placeholder="Password"
          textContentType="password"
          passwordRules="minlength: 20; required: lower; required: upper; required: digit; required: [-];"
          errorMessage={errors?.password && null}
          returnKeyType="next"
          onSubmitEditing={() => {
            confirmPasswordRef.current.focus();
          }}
          blurOnSubmit={false}
          ref={passwordRef}
        />
        <FormInput
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          textContentType="password"
          errorMessage={errors?.password}
          returnKeyType="done"
          ref={confirmPasswordRef}
        />
        {password.length > 0 && (
          <PasswordCheckerView
            password={password}
            setIsPasswordValid={setIsPasswordValid}
            onLayout={(event) =>
              scrollViewRef.current.scrollTo({
                y: event.nativeEvent.layout.y - height / 2 + 35,
                animated: true,
              })
            }
          />
        )}
        <AgreementBox checked={checked} setChecked={setChecked} />
        <View style={registrationStyles.buttonContainer}>
          <ButtonLarge
            disabled={!checked || !isPasswordValid}
            onPress={handleSignUp}
          >
            Sign Up
          </ButtonLarge>
        </View>
        <LineView>Or</LineView>
        <ButtonSocialLogin type="facebook" />
        <ButtonSocialLogin type="google" />
        <AuthSwitchPrompt />
      </ScrollView>

      <LoadingDialog
        visible={authState.isLoading}
        title="Signing up..."
        onCancel={() => abort()}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUp;
