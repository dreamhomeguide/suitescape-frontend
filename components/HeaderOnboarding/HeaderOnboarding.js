import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

import style from "./HeaderOnboardingStyles";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import Button from "../Button/Button";
import ButtonBack from "../ButtonBack/ButtonBack";

const HeaderOnboarding = ({
  index,
  onPrevButtonClick,
  showSkipButton = false,
}) => {
  const navigation = useNavigation();
  const { disableOnboarding } = useSettings();

  const handleSignInButtonClick = async () => {
    await disableOnboarding();
    navigation.replace(Routes.LOGIN);
  };

  return (
    <View style={style.header}>
      <View style={style.headerLeft}>
        {index > 0 && <ButtonBack onPress={onPrevButtonClick} />}
      </View>
      <View style={style.headerRight}>
        {index === 0 && (
          <Button
            inverted
            onPress={handleSignInButtonClick}
            containerStyle={style.buttonContainer}
            textStyle={style.buttonText}
          >
            Skip
          </Button>
        )}
        {showSkipButton && (
          <Button
            inverted
            onPress={handleSignInButtonClick}
            containerStyle={style.buttonContainer}
            textStyle={style.buttonText}
          >
            Sign In
          </Button>
        )}
      </View>
    </View>
  );
};

export default HeaderOnboarding;
