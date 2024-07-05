import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useMemo } from "react";
import { useColorScheme } from "react-native";

import {
  bottomTabOptions,
  darkThemeTabOptions,
  renderProfileImage,
  renderTabIcons,
} from "./BottomTabs";
import { useActiveCarts } from "../../contexts/CartContext";
import useCartTimer from "../../hooks/useCartTimer";
import useProfilePicture from "../../hooks/useProfilePicture";
import useUnreadCount from "../../hooks/useUnreadCount";
import useUpdates from "../../hooks/useUpdates";
import Bookings from "../../screens/Bookings/Bookings";
import Cart from "../../screens/Cart/Cart";
import ChatList from "../../screens/ChatList/ChatList";
import Home from "../../screens/Home/Home";
import Profile from "../../screens/Profile/Profile";
import { Routes } from "../Routes";

const Tabs = createBottomTabNavigator();

const GuestTabs = () => {
  const unreadCount = useUnreadCount();
  const colorScheme = useColorScheme();
  const profilePicture = useProfilePicture();
  const activeCarts = useActiveCarts();

  // Timers for cart expiration
  useCartTimer();

  // Subscribe to various feature updates
  useUpdates();

  const tabIcons = useMemo(
    () => ({
      [Routes.VIDEO_FEED]: {
        iconName: "home-regular",
        iconFocused: "home-solid",
      },
      [Routes.CHAT_LIST]: {
        iconName: "message-regular",
        iconFocused: "message-solid",
        badge: unreadCount,
      },
      [Routes.CART]: {
        iconName: "cart-regular",
        iconFocused: "cart-solid",
        badge: activeCarts.length,
      },
      [Routes.BOOKINGS]: {
        iconName: "bookings-regular",
        iconFocused: "bookings-solid",
      },
      [Routes.PROFILE]: {
        render: (props) => renderProfileImage(profilePicture, props),
      },
    }),
    [profilePicture, unreadCount],
  );

  const navigatorOptions = useCallback(
    ({ route }) => ({
      ...(colorScheme === "dark" ? darkThemeTabOptions : bottomTabOptions),
      tabBarIcon: (props) => renderTabIcons(tabIcons, props, route),
    }),
    [colorScheme, tabIcons],
  );

  const groupOptions = useMemo(
    () => ({
      headerShown: true,
      headerTitleStyle: { fontSize: 20 },
      headerShadowVisible: false,
    }),
    [],
  );

  return (
    <Tabs.Navigator screenOptions={navigatorOptions}>
      <Tabs.Screen
        name={Routes.VIDEO_FEED}
        component={Home}
        options={darkThemeTabOptions}
      />

      <Tabs.Group screenOptions={groupOptions}>
        <Tabs.Screen name={Routes.CHAT_LIST} component={ChatList} />
        <Tabs.Screen name={Routes.CART} component={Cart} />
        <Tabs.Screen name={Routes.BOOKINGS} component={Bookings} />
        <Tabs.Screen name={Routes.PROFILE} component={Profile} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
};

export default GuestTabs;
