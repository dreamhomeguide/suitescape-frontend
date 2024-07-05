import { useIsFocused } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./OnboardingHostStyles";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonBack from "../../components/ButtonBack/ButtonBack";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import { useSettings } from "../../contexts/SettingsContext";

const OnboardingHost = () => {
  const { modifySetting } = useSettings();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const onGetStarted = useCallback(() => {
    modifySetting("hostModeEnabled", true);
  }, []);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: "",
  //     headerTransparent: true,
  //     headerTintColor: "white",
  //   });
  // }, [navigation]);

  return (
    <View style={globalStyles.flexFull}>
      <StatusBar style={isFocused ? "light" : "auto"} />
      <ImageBackground
        transition={100}
        style={style.mainContainer({ topInsets: insets.top })}
        source={require("../../assets/images/onboarding/host-page.png")}
      >
        <ButtonBack color="white" />

        <View style={style.contentContainer}>
          <Text style={style.subHeaderText}>Want to be a Host?</Text>
          <Text style={style.headerText}>List your place now</Text>
        </View>
      </ImageBackground>

      <AppFooter transparent containerStyle={style.footer}>
        {/*<View style={{ backgroundColor: "black", borderRadius: 10 }}>*/}
        <ButtonLarge onPress={onGetStarted}>Get Started</ButtonLarge>
        {/*</View>*/}
      </AppFooter>
    </View>
  );
};

export default OnboardingHost;
