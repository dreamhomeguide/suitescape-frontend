import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import style from "./OnboardingStyles";
import globalStyles from "../../assets/styles/globalStyles";
import Button from "../../components/Button/Button";
import DotsView from "../../components/DotsView/DotsView";
import HeaderOnboarding from "../../components/HeaderOnboarding/HeaderOnboarding";
import LogoText from "../../components/LogoText/LogoText";
import OnboardingItem from "../../components/OnboardingItem/OnboardingItem";
import Slider from "../../components/Slider/Slider";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import slides from "../../data/slideData";
import { Routes } from "../../navigation/Routes";

const Onboarding = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const endReached = index === slides.length - 1;

  const { width } = useWindowDimensions();
  const { modifySetting } = useSettings();
  const { enableGuestMode } = useAuth();

  // const highScreenHeight = height > 700;

  const handleNextButtonClick = () => {
    if (!endReached) {
      sliderRef.current.scrollToIndex({
        index: index + 1,
        animated: true,
      });
      return;
    }

    // modifySetting("onboardingEnabled", false).then(() => {
    //   navigation.replace(Routes.SIGNUP);
    // });
    navigation.replace(Routes.SIGNUP);
  };

  const handlePrevButtonClick = () => {
    sliderRef.current.scrollToIndex({
      index: index - 1,
      animated: true,
    });
  };

  const handleSkipButtonClick = () => {
    enableGuestMode().then(() => {
      modifySetting("onboardingEnabled", false);
    });
  };

  const renderItem = useCallback(
    ({ item }) => <OnboardingItem {...item} />,
    [],
  );

  return (
    <SafeAreaView style={globalStyles.flexFull}>
      <StatusBar style="light" />
      <HeaderOnboarding
        index={index}
        onPrevButtonClick={handlePrevButtonClick}
        // signInEnabled={endReached && !highScreenHeight}
      />
      <LogoText />
      <Slider
        ref={sliderRef}
        data={slides}
        index={index}
        onIndexChange={setIndex}
        width={width}
        renderItem={renderItem}
      />
      <DotsView
        index={index}
        length={slides.length}
        containerStyle={globalStyles.flexFull}
        onDotClicked={(i) =>
          sliderRef.current.scrollToIndex({ index: i, animated: true })
        }
      />
      <View style={style.buttonContainer}>
        <Button onPress={handleNextButtonClick} containerStyle={style.button}>
          {endReached ? "Get Started" : "Next"}
        </Button>
        {endReached && (
          <Button
            outlined
            onPress={handleSkipButtonClick}
            containerStyle={style.button}
          >
            Maybe Later
          </Button>
        )}
      </View>
      {/*{endReached && highScreenHeight && <AuthSwitchPrompt isOnboarding />}*/}
    </SafeAreaView>
  );
};

export default Onboarding;
