import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ProfileStyles";
import { Colors } from "../../assets/Colors";
import { pressedBgColor } from "../../assets/styles/globalStyles";
import Button from "../../components/Button/Button";
import Chip from "../../components/Chip/Chip";
import LoadingDialog from "../../components/LoadingDialog/LoadingDialog";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import { useAuth } from "../../contexts/AuthContext";
import capitalizedText from "../../utilities/textCapitalizer";
import splitTextSpaced from "../../utilities/textSplitSpacer";

const Profile = () => {
  const { authState, signOut } = useAuth();

  const insets = useSafeAreaInsets();

  const settings = {
    profile: [
      {
        title: "Manage my account",
        onPress: () => {},
      },
      {
        title: "Change password",
        onPress: () => {},
      },
      {
        title: "Saved",
        onPress: () => {},
      },
      {
        title: "Want to be a host?",
        onPress: () => {},
      },
      {
        title: "Change payment method",
        onPress: () => {},
      },
    ],
    feedback: [
      {
        title: "App Feedback",
        onPress: () => {},
      },
    ],
    legal_information: [
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
    support: [
      {
        title: "Help Centre",
        onPress: () => {},
      },
      {
        title: "How Suitescape Works",
        onPress: () => {},
      },
      {
        title: "Report A Problem",
        onPress: () => {},
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
        onPress: () => signOut(),
        style: "destructive",
      },
    ]);
  };

  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <ScrollView contentInset={{ bottom: insets.bottom }}>
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

      {Object.entries(settings).map(([key, value]) => (
        <View style={style.settingsKeyContainer} key={key}>
          <Text style={style.settingsKey({ textColor: colors.text })}>
            {capitalizedText(splitTextSpaced(key), true)}
          </Text>

          {value.map(({ title, onPress }) => (
            <Pressable
              key={title}
              style={({ pressed }) => ({
                ...pressedBgColor(
                  pressed,
                  colorScheme === "dark" ? colors.border : "lightgray",
                ),
                ...(pressed && style.settingsValuePressed),
              })}
              onPress={onPress}
            >
              <View
                style={style.settingsValueContainer({
                  borderColor: colors.border,
                })}
              >
                <Text style={{ color: colors.text }}>{title}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={21}
                  color={Colors.blue}
                />
              </View>
            </Pressable>
          ))}
        </View>
      ))}

      <Button
        inverted
        color={Colors.red}
        containerStyle={style.logoutButtonContainer}
        textStyle={style.logoutButton}
        onPress={() => promptLogout()}
      >
        Logout
      </Button>

      {/*<ButtonLink*/}
      {/*  containerStyle={style.logoutButtonContainer}*/}
      {/*  textStyle={style.logoutButton}*/}
      {/*  onPress={() => promptLogout()}*/}
      {/*>*/}
      {/*  Logout*/}
      {/*</ButtonLink>*/}
      <LoadingDialog visible={authState.isLoading} title="Logging out..." />
    </ScrollView>
  );
};

export default Profile;
