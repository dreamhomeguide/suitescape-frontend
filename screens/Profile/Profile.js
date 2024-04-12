import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useScrollToTop, useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef } from "react";
import { Alert, Pressable, ScrollView, SectionList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ProfileStyles";
import { Colors } from "../../assets/Colors";
import Button from "../../components/Button/Button";
import Chip from "../../components/Chip/Chip";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import ProfileSettingHeader from "../../components/ProfileSettingHeader/ProfileSettingHeader";
import ProfileSettingItem from "../../components/ProfileSettingItem/ProfileSettingItem";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import useProfilePicture from "../../hooks/useProfilePicture";
import { Routes } from "../../navigation/Routes";

const Profile = ({ navigation }) => {
  const { authState, signOut } = useAuth();

  const { settings, modifySetting } = useSettings();
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
          },
          {
            title: "Change password",
            onPress: () => navigation.navigate(Routes.CHANGE_PASSWORD),
          },
          {
            title: "Saved",
            onPress: () => navigation.navigate(Routes.SAVED),
          },
          {
            title: "Liked",
            onPress: () => navigation.navigate(Routes.LIKED),
          },
        ],
      },
      {
        title: "Hosting",
        data: [
          {
            title: "Want to be a host?",
            onPress: () => navigation.navigate(Routes.ONBOARDING_HOST),
            enableOnGuestMode: true,
          },
        ],
      },
      {
        title: "Feedback",
        data: [
          {
            title: "App Feedback",
            onPress: () => navigation.navigate(Routes.APP_FEEDBACK),
            enableOnGuestMode: true,
          },
        ],
      },
      {
        title: "Legal Information",
        data: [
          {
            title: "Terms & Conditions",
            onPress: () => {},
            enableOnGuestMode: true,
          },
          {
            title: "Privacy Policy",
            onPress: () => {},
            enableOnGuestMode: true,
          },
          {
            title: "About Us",
            onPress: () => {},
            enableOnGuestMode: true,
          },
        ],
      },
      {
        title: "Support",
        data: [
          {
            title: "Help Centre",
            onPress: () => {},
            enableOnGuestMode: true,
          },
          {
            title: "How Suitescape Works",
            onPress: () => {},
            enableOnGuestMode: true,
          },
        ],
      },
    ],
    [navigation],
  );

  const promptLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: signOut,
        style: "destructive",
      },
    ]);
  }, []);

  const filteredProfileSettings = useMemo(
    () =>
      profileSettings.filter(
        ({ data }) =>
          !settings.guestModeEnabled ||
          data.some(
            (profileSettingItem) => profileSettingItem.enableOnGuestMode,
          ),
      ),
    [settings.guestModeEnabled],
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

  return (
    <ScrollView ref={scrollViewRef} contentInset={{ bottom: insets.bottom }}>
      <FocusAwareStatusBar style="dark" animated />
      <View style={style.headerContainer}>
        <Pressable
          onLongPress={() => {
            modifySetting("onboardingEnabled", true);
            Alert.alert("Onboarding enabled");
          }}
        >
          <ProfileImage source={profilePicture} size={100} />
        </Pressable>

        {!settings.guestModeEnabled && (
          <Chip
            inverted
            renderIcon={({ size, color }) => (
              <FontAwesome5 name="check" size={size} color={color} />
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
          onPress={signOut}
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
