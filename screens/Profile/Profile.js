import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useScrollToTop, useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef } from "react";
import { Alert, Pressable, ScrollView, SectionList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ProfileStyles";
import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import Button from "../../components/Button/Button";
import Chip from "../../components/Chip/Chip";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import ProfileSettingHeader from "../../components/ProfileSettingHeader/ProfileSettingHeader";
import ProfileSettingItem from "../../components/ProfileSettingItem/ProfileSettingItem";
import { useAuth } from "../../contexts/AuthContext";
import { useBookingContext } from "../../contexts/BookingContext";
import { useCartContext } from "../../contexts/CartContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useTimerContext } from "../../contexts/TimerContext";
import { useVideoFilters } from "../../contexts/VideoFiltersContext";
import useProfilePicture from "../../hooks/useProfilePicture";
import { Routes } from "../../navigation/Routes";

const Profile = ({ navigation }) => {
  const { authState, disableGuestMode, signOut } = useAuth();

  const { setVideoFilters } = useVideoFilters();
  const { clearAllBookingInfo } = useBookingContext();
  const { settings, modifySetting } = useSettings();
  const { clearAllCart } = useCartContext();
  const { stopAllTimers } = useTimerContext();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const profilePicture = useProfilePicture();

  const scrollViewRef = useRef(null);

  useScrollToTop(scrollViewRef);

  const profileSettings = useMemo(
    () => [
      {
        title: "Profile",
        data: [
          {
            title: "Manage my account",
            onPress: () => navigation.navigate(Routes.MANAGE_ACCOUNT),
            enableOnGuestMode: false,
          },
          {
            title: "Change password",
            onPress: () => navigation.navigate(Routes.CHANGE_PASSWORD),
            enableOnGuestMode: false,
          },
          {
            title: "Saved",
            onPress: () => navigation.navigate(Routes.SAVED),
            enableOnGuestMode: false,
          },
          {
            title: "Liked",
            onPress: () => navigation.navigate(Routes.LIKED),
            enableOnGuestMode: false,
          },
        ],
      },
      {
        title: "Travel Deals",
        data: [
          {
            title: "Packages",
            onPress: () => navigation.navigate(Routes.PACKAGES),
            enableOnHostMode: false,
          },
        ],
      },
      {
        title: "Hosting",
        data: [
          {
            title: settings.hostModeEnabled
              ? "Switch to Traveler"
              : "Switch to Host",
            onPress: () => {
              if (settings.hostModeEnabled) {
                modifySetting("hostModeEnabled", false);
              } else {
                navigation.navigate(Routes.ONBOARDING_HOST);
              }
            },
            enableOnGuestMode: false,
          },
          {
            title: "Earnings",
            onPress: () => navigation.navigate(Routes.EARNINGS),
            enableOnHostMode: true,
          },
        ],
      },
      {
        title: "Feedback",
        data: [
          {
            title: "App Feedback",
            onPress: () => navigation.navigate(Routes.APP_FEEDBACK),
          },
        ],
      },
      {
        title: "Legal Information",
        data: [
          {
            title: "Terms & Conditions",
            onPress: () => {},
          },
          {
            title: "Privacy Policy",
            onPress: () => {},
          },
          {
            title: "About Us",
            onPress: () => {},
          },
        ],
      },
      {
        title: "Support",
        data: [
          {
            title: "Help Centre",
            onPress: () => {},
          },
          {
            title: "How Suitescape Works",
            onPress: () => {},
          },
        ],
      },
    ],
    [navigation, settings.hostModeEnabled],
  );

  const handleLogout = useCallback(async () => {
    // Clear cart to prevent overlapping cart on other accounts
    stopAllTimers();
    clearAllCart();

    // Clear global booking info
    clearAllBookingInfo();

    // Clear the video filters
    setVideoFilters(null);

    // If the user is in guest mode, just disable it
    if (settings.guestModeEnabled) {
      disableGuestMode();
      return;
    }

    await signOut();
  }, [settings.guestModeEnabled]);

  const promptLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: handleLogout,
        style: "destructive",
      },
    ]);
  }, [handleLogout]);

  const filteredProfileSettings = useMemo(
    () =>
      profileSettings
        .map((section) => ({
          ...section,
          data: section.data.filter((item) => {
            return !(
              (item.enableOnGuestMode === false && settings.guestModeEnabled) ||
              (item.enableOnHostMode === false && settings.hostModeEnabled) ||
              (item.enableOnHostMode === true && !settings.hostModeEnabled)
            );
          }),
        }))
        .filter((section) => section.data.length > 0),
    [profileSettings, settings.guestModeEnabled, settings.hostModeEnabled],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <ProfileSettingHeader title={section.title} />,
    [],
  );

  const renderSectionFooter = useCallback(
    () => <View style={style.footer} />,
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ProfileSettingItem title={item.title} onPress={item.onPress} />
    ),
    [],
  );

  const onProfilePress = useCallback(
    () =>
      navigation.navigate(Routes.PROFILE_HOST, {
        hostId: authState.userId,
      }),
    [navigation, authState.userId],
  );

  // For testing purposes only
  const onOnboarding = useCallback(() => {
    modifySetting("onboardingEnabled", true);
    Alert.alert("Onboarding enabled");
  }, []);

  return (
    <ScrollView ref={scrollViewRef} contentInset={{ bottom: insets.bottom }}>
      <FocusAwareStatusBar style="dark" animated />

      <View style={style.headerContainer}>
        <Pressable
          onPress={onProfilePress}
          onLongPress={onOnboarding}
          disabled={settings.guestModeEnabled}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <ProfileImage source={profilePicture} size={100} />
        </Pressable>

        {!settings.guestModeEnabled && (
          <Chip
            inverted
            renderIcon={({ size, color }) => (
              <FontAwesome6 name="check" size={size} color={color} />
            )}
          >
            Verified
          </Chip>
        )}
      </View>

      <View
        style={style.headerDivider({
          color: colors.border,
        })}
      />

      <SectionList
        sections={filteredProfileSettings}
        keyExtractor={(item) => item.title}
        initialNumToRender={15} // Prevents log out button from being shown
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        renderItem={renderItem}
        scrollEnabled={false}
      />

      {settings.guestModeEnabled ? (
        <Button
          inverted
          containerStyle={style.bottomButtonContainer}
          textStyle={style.loginButton}
          onPress={handleLogout}
        >
          Login/Signup
        </Button>
      ) : (
        <Button
          inverted
          color={Colors.red}
          containerStyle={style.bottomButtonContainer}
          textStyle={style.logoutButton}
          onPress={promptLogout}
        >
          Logout
        </Button>
      )}

      <DialogLoading
        visible={authState.isLoading}
        title={settings.guestModeEnabled ? "Please wait..." : "Logging out..."}
      />
    </ScrollView>
  );
};

export default Profile;
