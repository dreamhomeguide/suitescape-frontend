import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, SafeAreaView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./FeedbackStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";

const Feedback = ({ navigation, route }) => {
  const {
    type,
    title,
    subtitle,
    screenToNavigate,
    popToTop = true,
  } = route.params;
  const insets = useSafeAreaInsets();

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

  useEffect(() => {
    if (feedbackType[type]?.haptic) {
      Haptics.notificationAsync(feedbackType[type].haptic);
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        ...globalStyles.flexFull,
        ...(feedbackType[type] && {
          backgroundColor: feedbackType[type].color,
        }),
      }}
    >
      <Pressable
        style={globalStyles.flexFull}
        onPress={() => {
          popToTop && navigation.popToTop();
          screenToNavigate && navigation.navigate(screenToNavigate);
        }}
      >
        <View style={style.mainContainer}>
          <View style={style.contentContainer}>
            {feedbackType[type] && (
              <FontAwesome5
                name={feedbackType[type].icon}
                size={100}
                color="white"
                style={style.icon}
              />
            )}

            <Text style={style.headerText}>{title}</Text>
            <Text style={style.subHeaderText}>{subtitle}</Text>
          </View>
        </View>
        <View
          style={{
            ...style.continueContainer,
            marginBottom: insets.bottom + StatusBar.currentHeight + 25,
          }}
        >
          <Text style={style.text}>Tap to continue</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Feedback;
