import { useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import style from "./OnboardingStyles";
import Button from "../../components/Button/Button";
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

  const { width } = useWindowDimensions();
  const { disableOnboarding, enableGuestMode } = useSettings();

  const queryClient = useQueryClient();

  // const highScreenHeight = height > 700;

  const handleNextButtonClick = () => {
    if (!endReached) {
      sliderRef.current.scrollToIndex({
        index: index + 1,
        animated: true,
      });
      return;
    }

    disableOnboarding().then(() => {
      navigation.replace(Routes.SIGNUP);
    });
  };

  const handlePrevButtonClick = () => {
    sliderRef.current.scrollToIndex({
      index: index - 1,
      animated: true,
    });
  };

  const handleSkipButtonClick = async () => {
    await queryClient.resetQueries();
    await enableGuestMode();
    await disableOnboarding();
  };

  return (
    <SafeAreaView>
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
        <Button
          onPress={handleNextButtonClick}
          containerStyle={{ paddingVertical: 14 }}
        >
          {endReached ? "Get Started" : "Next"}
        </Button>
        {endReached && (
          <Button
            outlined
            onPress={handleSkipButtonClick}
            containerStyle={{ paddingVertical: 14 }}
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
