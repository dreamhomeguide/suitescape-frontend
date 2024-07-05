import { ImageBackground } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./OnboardingListingStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonBack from "../../components/ButtonBack/ButtonBack";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import { Routes } from "../../navigation/Routes";

const OnboardingListing = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const onGetStarted = useCallback(() => {
    navigation.navigate(Routes.CREATE_LISTING);
  }, [navigation]);

  return (
    <View style={globalStyles.flexFull}>
      <StatusBar style="light" />
      <ImageBackground
        transition={100}
        style={style.imageContainer({ topInsets: insets.top })}
        source={require("../../assets/images/onboarding/host-page.png")}
      >
        <ButtonBack color="white" />
      </ImageBackground>

      <AppFooter>
        <View style={style.footerContentContainer}>
          <Text style={{ ...globalStyles.headerText, color: Colors.blue }}>
            List your property now
          </Text>
          <Text>
            List your staycation property on Suitescape, where guests can
            experience luxurious accommodations.
          </Text>
        </View>
        <ButtonLarge onPress={onGetStarted}>Get Started</ButtonLarge>
      </AppFooter>
    </View>
  );
};

export default OnboardingListing;
