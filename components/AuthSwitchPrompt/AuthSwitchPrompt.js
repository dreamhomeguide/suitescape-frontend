import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

import style from "./AuthSwitchPromptStyles";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import ButtonLink from "../ButtonLink/ButtonLink";

const AuthSwitchPrompt = ({ isRegistration = false, isOnboarding = false }) => {
  const navigation = useNavigation();

  const { modifySetting } = useSettings();

  const handleNextScreen = () => {
    const nextScreen = isRegistration ? Routes.SIGNUP : Routes.LOGIN;

    if (isOnboarding) {
      modifySetting("onboardingEnabled", false);
      navigation.replace(nextScreen);
    } else {
      navigation.navigate(nextScreen);
    }
  };

  return (
    <View style={style.container}>
      <Text
        style={{
          ...style.text,
          ...style.hint,
        }}
      >
        {isRegistration ? "Don't have an account?" : "Already have an account?"}
      </Text>
      <ButtonLink
        onPress={handleNextScreen}
        textStyle={{ ...style.text, ...style.link }}
      >
        {isRegistration ? "Create Account" : "Sign In"}
      </ButtonLink>
    </View>
  );
};

export default AuthSwitchPrompt;
