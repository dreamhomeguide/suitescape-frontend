import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect } from "react";
import { Platform, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./FeedbackStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

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

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === "ios" && feedbackType[type]?.haptic) {
      Haptics.notificationAsync(feedbackType[type].haptic).then(() => {
        console.log("Haptic feedback played for", type, "feedback");
      });
    }
  }, []);

  const handlePress = useCallback(() => {
    if (popToTop) {
      navigation.popToTop();
      screenToNavigate && navigation.navigate(screenToNavigate);
    } else {
      screenToNavigate && navigation.replace(screenToNavigate, replaceProps);
    }
  }, [navigation, popToTop, replaceProps, screenToNavigate]);

  return (
    <Pressable onPress={handlePress} style={globalStyles.flexFull}>
      <BlurView
        intensity={80}
        tint="light"
        // experimentalBlurMethod="dimezisBlurView" // Will cause white screen on Android
        style={globalStyles.flexFull}
      >
        <StatusBar barStyle="light-content" />

        <View style={style.mainContainer}>
          <View style={style.contentContainer}>
            {feedbackType[type] && (
              <FontAwesome5
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
        <View
          style={{
            ...style.continueContainer,
            marginBottom: insets.bottom + StatusBar.currentHeight + 25,
          }}
        >
          <Text style={{ ...style.text, color: "rgba(255,255,255,0.8)" }}>
            Tap to continue
          </Text>
        </View>
      </BlurView>
    </Pressable>
  );
};

export default Feedback;
