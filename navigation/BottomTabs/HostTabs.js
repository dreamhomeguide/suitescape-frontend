import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useMemo } from "react";
import { useColorScheme } from "react-native";

import {
  bottomTabOptions,
  darkThemeTabOptions,
  renderProfileImage,
  renderTabIcons,
} from "./BottomTabs";
import useProfilePicture from "../../hooks/useProfilePicture";
import useUnreadCount from "../../hooks/useUnreadCount";
import Bookings from "../../screens/Bookings/Bookings";
import Calendar from "../../screens/Calendar/Calendar";
import ChatList from "../../screens/ChatList/ChatList";
import Listings from "../../screens/Listings/Listings";
import Profile from "../../screens/Profile/Profile";
import { Routes } from "../Routes";

const Tabs = createBottomTabNavigator();

const HostTabs = () => {
  const unreadCount = useUnreadCount();
  const profilePicture = useProfilePicture();
  const colorScheme = useColorScheme();

  const tabIcons = useMemo(
    () => ({
      [Routes.LISTINGS]: {
        iconName: "home-regular",
        iconFocused: "home-solid",
      },
      [Routes.BOOKINGS]: {
        iconName: "bookings-regular",
        iconFocused: "bookings-solid",
      },
      [Routes.CHAT_LIST]: {
        iconName: "message-regular",
        iconFocused: "message-solid",
        badge: unreadCount,
      },
      [Routes.PROFILE]: {
        render: (props) => renderProfileImage(profilePicture, props),
      },
    }),
    [profilePicture, unreadCount],
  );

  const screenOptions = useCallback(
    ({ route }) => ({
      ...(colorScheme === "dark" ? darkThemeTabOptions : bottomTabOptions),
      tabBarIcon: (props) => renderTabIcons(tabIcons, props, route),
      headerShown: true,
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
    }),
    [colorScheme, tabIcons],
  );

  return (
    <Tabs.Navigator screenOptions={screenOptions}>
      <Tabs.Screen
        name={Routes.LISTINGS}
        component={Listings}
        options={{ headerShown: false }}
      />
      <Tabs.Screen name={Routes.BOOKINGS} component={Bookings} />
      <Tabs.Screen name={Routes.CHAT_LIST} component={ChatList} />
      <Tabs.Screen name={Routes.PROFILE} component={Profile} />
    </Tabs.Navigator>
  );
};

export default HostTabs;
