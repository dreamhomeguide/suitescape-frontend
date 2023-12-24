import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useScrollToTop, useTheme } from "@react-navigation/native";
import React, { useRef } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ProfileStyles";
import { Colors } from "../../assets/Colors";
import Button from "../../components/Button/Button";
import Chip from "../../components/Chip/Chip";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useVideoFilter } from "../../contexts/VideoFilterContext";
import { Routes } from "../../navigation/Routes";
import capitalizedText from "../../utilities/textCapitalizer";
import splitTextSpaced from "../../utilities/textSplitSpacer";

const Profile = ({ navigation }) => {
  const { authState, signOut } = useAuth();

  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { setVideoFilter } = useVideoFilter();
  const { settings } = useSettings();

  const scrollViewRef = useRef(null);

  useScrollToTop(scrollViewRef);

  const profileSettings = {
    profile: [
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
    hosting: [
      {
        title: "Want to be a host?",
        onPress: () => {},
        enableOnGuestMode: true,
      },
    ],
    feedback: [
      {
        title: "App Feedback",
        onPress: () => {},
        enableOnGuestMode: true,
      },
    ],
    legal_information: [
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
    support: [
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
      {
        title: "Report A Problem",
        onPress: () => {},
        enableOnGuestMode: true,
      },
    ],
  };

  const promptLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: logOut,
        style: "destructive",
      },
    ]);
  };

  const logOut = () => {
    signOut().then(() => setVideoFilter(null));
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentInset={{ bottom: insets.bottom + 10 }}
    >
      <View style={style.headerContainer}>
        <ProfileImage size={100} />
        <Chip
          inverted
          renderIcon={({ size, color }) => (
            <FontAwesome5 name="check" size={size} color={color} />
          )}
        >
          Verified
        </Chip>
      </View>

      <View
        style={style.headerDivider({
          color: colors.border,
        })}
      />

      {Object.entries(profileSettings)
        .filter(
          ([_, value]) =>
            !settings.guestModeEnabled ||
            value.some((profileSetting) => profileSetting.enableOnGuestMode),
        )
        .map(([key, value]) => (
          <View style={style.settingsKeyContainer} key={key}>
            <Text style={{ ...style.settingsKey, color: colors.text }}>
              {capitalizedText(splitTextSpaced(key), true)}
            </Text>

            {value
              .filter(
                (profileSetting) =>
                  !settings.guestModeEnabled ||
                  profileSetting.enableOnGuestMode,
              )
              .map(({ title, onPress }) => (
                <RectButton
                  key={title}
                  // style={{
                  //   ...pressedBgColor(pressed, colors.border),
                  //   ...(pressed && style.settingsValuePressed),
                  // })}
                  style={style.settingsValuePressed}
                  onPress={onPress}
                >
                  <View
                    style={{
                      ...style.settingsValueContainer,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <Text style={{ color: colors.text }}>{title}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={21}
                      color={Colors.blue}
                    />
                  </View>
                </RectButton>
              ))}
          </View>
        ))}

      {settings.guestModeEnabled ? (
        <Button
          inverted
          containerStyle={style.bottomButtonContainer}
          textStyle={style.loginButton}
          onPress={() => logOut()}
        >
          Login/Signup
        </Button>
      ) : (
        <Button
          inverted
          color={Colors.red}
          containerStyle={style.bottomButtonContainer}
          textStyle={style.logoutButton}
          onPress={() => promptLogout()}
        >
          Logout
        </Button>
      )}

      {/*<ButtonLink*/}
      {/*  containerStyle={style.logoutButtonContainer}*/}
      {/*  textStyle={style.logoutButton}*/}
      {/*  onPress={() => promptLogout()}*/}
      {/*>*/}
      {/*  Logout*/}
      {/*</ButtonLink>*/}
      <DialogLoading
        visible={authState.isLoading}
        title={settings.guestModeEnabled ? "Please wait..." : "Logging out..."}
      />
    </ScrollView>
  );
};

export default Profile;
