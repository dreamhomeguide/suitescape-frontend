import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import style from "./OnboardingStyles";
import AuthSwitchPrompt from "../../components/AuthSwitchPrompt/AuthSwitchPrompt";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import DotsView from "../../components/DotsView/DotsView";
import HeaderOnboarding from "../../components/HeaderOnboarding/HeaderOnboarding";
import LogoText from "../../components/LogoText/LogoText";
import OnboardingItem from "../../components/OnboardingItem/OnboardingItem";
import Slider from "../../components/Slider/Slider";
import { useSettings } from "../../contexts/SettingsContext";
import slides from "../../data/slideData";
import { Routes } from "../../navigation/Routes";

const Onboarding = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const endReached = index === slides.length - 1;

  const { width, height } = useWindowDimensions();
  const { disableOnboarding } = useSettings();

  const highScreenHeight = height > 850;

  const handleNextButtonClick = async () => {
    if (endReached) {
      await disableOnboarding();
      navigation.replace(Routes.SIGNUP);
      return;
    }
    sliderRef.current.scrollToIndex({ index: index + 1, animated: true });
  };

  const handlePrevButtonClick = () => {
    sliderRef.current.scrollToIndex({
      index: index - 1,
      animated: true,
    });
  };

  return (
    <SafeAreaView>
      <StatusBar style="light" />
      <HeaderOnboarding
        index={index}
        onPrevButtonClick={handlePrevButtonClick}
        showSkipButton={endReached && !highScreenHeight}
      />
      <LogoText />
      <Slider
        ref={sliderRef}
        data={slides}
        index={index}
        onIndexChange={setIndex}
        width={width}
        renderItem={({ item }) => <OnboardingItem {...item} />}
      />
      <DotsView
        index={index}
        length={slides.length}
        onDotClicked={(i) =>
          sliderRef.current.scrollToIndex({ index: i, animated: true })
        }
      />
      <View style={style.nextButtonContainer}>
        <ButtonLarge onPress={handleNextButtonClick}>
          {endReached ? "Get Started" : "Next"}
        </ButtonLarge>
      </View>
      {endReached && highScreenHeight && <AuthSwitchPrompt isOnboarding />}
    </SafeAreaView>
  );
};

export default Onboarding;
