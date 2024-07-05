import { FontAwesome6 } from "@expo/vector-icons";
import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  Text,
  View,
} from "react-native";

import style from "./FeedbackStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import BottomSheet from "../../components/BottomSheet/BottomSheet";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";

const feedbackType = {
  success: {
    icon: "check-circle",
    color: Colors.green,
    haptic: Haptics.NotificationFeedbackType.Success,
  },
  error: {
    icon: "times-circle",
    color: Colors.red,
    haptic: Haptics.NotificationFeedbackType.Error,
  },
  warning: {
    icon: "exclamation-circle",
    color: Colors.yellow,
    haptic: Haptics.NotificationFeedbackType.Warning,
  },
};

const Feedback = ({ navigation, route }) => {
  const {
    type,
    title,
    subtitle,
    screenToNavigate,
    replaceProps,
    popToTop = true,
  } = route.params;

  useEffect(() => {
    if (Platform.OS === "ios" && feedbackType[type]?.haptic) {
      Haptics.notificationAsync(feedbackType[type].haptic).then(() => {
        console.log("Haptic feedback played for", type, "feedback");
      });
    }
  }, []);

  const handleContinue = useCallback(() => {
    if (popToTop) {
      navigation.popToTop();
      screenToNavigate && navigation.navigate(screenToNavigate);
    } else {
      screenToNavigate && navigation.replace(screenToNavigate, replaceProps);
    }
  }, [navigation, popToTop, replaceProps, screenToNavigate]);

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <ButtonLarge onPress={handleContinue}>Continue</ButtonLarge>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [handleContinue],
  );

  return (
    <BlurView
      intensity={80}
      tint="light"
      // experimentalBlurMethod="dimezisBlurView" // Will cause white screen on Android
      style={globalStyles.flexFull}
    >
      <StatusBar barStyle="light-content" />

      {/* To make the user wait until it loads the next screen */}
      <ActivityIndicator size="large" style={globalStyles.flexCenter} />

      <BottomSheet
        visible
        enablePanDownToClose
        onClose={handleContinue}
        backdropProps={{ onPress: handleContinue }}
        footerComponent={renderFooter}
        modal={false}
      >
        <View style={style.mainContainer}>
          <View style={style.contentContainer}>
            {feedbackType[type] && (
              <FontAwesome6
                name={feedbackType[type].icon}
                size={100}
                color={feedbackType[type].color}
                style={style.icon}
              />
            )}

            <Text
              style={{
                ...style.headerText,
                color: feedbackType[type].color,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                ...style.subHeaderText,
                color: feedbackType[type].color,
              }}
            >
              {subtitle}
            </Text>
          </View>
        </View>
      </BottomSheet>
    </BlurView>
  );
};

export default Feedback;
