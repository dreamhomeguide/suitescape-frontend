import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo } from "react";
import { useColorScheme, View } from "react-native";

import style from "./BottomTabsStyles";
import { Colors } from "../../assets/Colors";
import Icon from "../../assets/fontello/Fontello";
import IconBadge from "../../components/IconBadge/IconBadge";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import { useAuth } from "../../contexts/AuthContext";
import { useBookingContext } from "../../contexts/BookingContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useVideoFilters } from "../../contexts/VideoFiltersContext";
import useChatSubscription from "../../hooks/useChatSubscription";
import useProfilePicture from "../../hooks/useProfilePicture";
import useProfileUpdates from "../../hooks/useProfileUpdates";
import Bookings from "../../screens/Bookings/Bookings";
import ChatList from "../../screens/ChatList/ChatList";
import Home from "../../screens/Home/Home";
import Profile from "../../screens/Profile/Profile";
import { fetchAllChats } from "../../services/apiService";
import { Routes } from "../Routes";

const Tabs = createBottomTabNavigator();

const tabBarStyle = {
  backgroundColor: "white",
  minHeight: 60,
  borderTopWidth: 0,
};

const bottomTabOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarActiveTintColor: Colors.blue,
  tabBarInactiveTintColor: Colors.lightblue,
  tabBarStyle,
};

const darkThemeTabOptions = {
  ...bottomTabOptions,
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: "white",
  tabBarStyle: {
    ...tabBarStyle,
    backgroundColor: "black",
  },
};

const BottomTabs = () => {
  const { authState } = useAuth();
  const { settings } = useSettings();
  const { setVideoFilters } = useVideoFilters();
  const { clearBookingInfo } = useBookingContext();
  const { subscribeToChats } = useChatSubscription();
  const { subscribeToProfileUpdates } = useProfileUpdates();
  const colorScheme = useColorScheme();
  const profilePicture = useProfilePicture();

  // Subscribe to chat updates when the user is authenticated
  useEffect(() => {
    if (authState.userId) {
      subscribeToChats(authState.userId);
    }
  }, [authState.userId, subscribeToChats]);

  useEffect(() => {
    // Subscribe to profile updates
    subscribeToProfileUpdates();

    return () => {
      // Clear global booking info
      clearBookingInfo();

      // Clear the video filters
      setVideoFilters(null);
    };
  }, []);

  const renderProfileImage = useCallback(
    ({ focused, size }) => (
      <ProfileImage
        source={profilePicture}
        size={size}
        borderWidth={focused ? 1 : 0}
        borderColor={Colors.blue}
      />
    ),
    [profilePicture],
  );

  const { data: unreadCount } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
    enabled: !settings.guestModeEnabled,
    select: (data) => {
      return data?.filter((chat) => chat.unread_messages_count > 0).length;
    },
  });

  const tabIcons = useMemo(
    () => ({
      [Routes.VIDEO_FEED]: {
        iconName: "home-regular",
        iconFocused: "home-solid",
      },
      [Routes.CHAT_LIST]: {
        iconName: "message-regular",
        iconFocused: "message-solid",
        notifications: unreadCount,
      },
      [Routes.BOOKINGS]: {
        iconName: "bookings-regular",
        iconFocused: "bookings-solid",
      },
      [Routes.PROFILE]: {
        render: renderProfileImage,
      },
    }),
    [renderProfileImage, unreadCount],
  );

  const renderTabIcons = useCallback(
    (props, route) => {
      const { focused, size, color } = props;
      const iconSize = size - 3;
      const tabIcon = tabIcons[route.name];
      const { iconName, iconFocused, notifications, render } = tabIcon ?? {};

      return (
        <>
          <View
            style={{
              ...style.iconContainer,
              ...{ marginBottom: focused ? 5 : 9 },
              ...{ opacity: focused ? 1 : 0.9 },
            }}
          >
            {iconName ? (
              <IconBadge count={notifications}>
                <Icon
                  name={focused ? iconFocused : iconName}
                  size={iconSize}
                  color={color}
                />
              </IconBadge>
            ) : (
              render({ focused, size, color })
            )}
          </View>

          {/* Show underline when focused */}
          {focused && (
            <View
              style={{
                ...style.underline,
                ...{ backgroundColor: color },
              }}
            />
          )}
        </>
      );
    },
    [tabIcons],
  );

  const screenOptions = useCallback(
    ({ route }) => ({
      ...(colorScheme === "dark" ? darkThemeTabOptions : bottomTabOptions),
      tabBarIcon: (props) => renderTabIcons(props, route),
    }),
    [colorScheme, renderTabIcons],
  );

  return (
    <Tabs.Navigator screenOptions={screenOptions}>
      <Tabs.Screen
        name={Routes.VIDEO_FEED}
        component={Home}
        options={darkThemeTabOptions}
      />

      <Tabs.Group
        screenOptions={{
          headerShown: true,
          headerTitleStyle: { fontSize: 20 },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen name={Routes.CHAT_LIST} component={ChatList} />
        <Tabs.Screen name={Routes.BOOKINGS} component={Bookings} />
        <Tabs.Screen name={Routes.PROFILE} component={Profile} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
};

export default BottomTabs;
