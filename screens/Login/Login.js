import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const insets = useSafeAreaInsets();
  const { authState, signIn, abort } = useAuth();

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

  const clearErrorWhenNotEmpty = (value, key) => {
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    }
  };

  const handleSignIn = () => {
    signIn({ email, password }).catch((errors) => setErrors(errors));
  };

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar animated />
      <LogoView />
      <HeaderText>Login</HeaderText>
      <View style={style.inputContainer}>
        <FormInput
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            clearErrorWhenNotEmpty(value, "email");
          }}
          placeholder="Email Address"
          // Bug: doesn't show cursor when this is on
          // keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
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
          textContentType="none"
          errorMessage={errors?.password}
          returnKeyType="done"
          ref={passwordRef}
        />
      </View>
      <View style={style.forgotPasswordButtonContainer}>
        <ButtonLink
          onPress={() => console.log("Forgot Password")}
          textStyle={style.forgotPasswordText}
        >
          Forgot Password?
        </ButtonLink>
      </View>
      <View style={style.buttonContainer}>
        <ButtonLarge onPress={handleSignIn}>Login</ButtonLarge>
      </View>
      <LineView>Or</LineView>
      <ButtonSocialLogin type="phone" />
      <ButtonSocialLogin type="facebook" />
      <ButtonSocialLogin type="google" />
      <AuthSwitchPrompt isRegistration />

      <DialogLoading
        visible={authState.isLoading}
        title="Logging in..."
        onCancel={() => abort()}
      />
    </ScrollView>
  );
};

export default Login;
