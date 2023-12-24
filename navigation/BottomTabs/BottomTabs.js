import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useColorScheme, View } from "react-native";

import style from "./BottomTabsStyles";
import { Colors } from "../../assets/Colors";
import Icon from "../../assets/fontello/Fontello";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import Bookings from "../../screens/Bookings/Bookings";
import Cart from "../../screens/Cart/Cart";
import Home from "../../screens/Home/Home";
import Messages from "../../screens/Messages/Messages";
import Profile from "../../screens/Profile/Profile";
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

const tabIcons = {
  [Routes.HOME]: {
    iconName: "home-regular",
    iconFocused: "home-solid",
  },
  [Routes.MESSAGES]: {
    iconName: "message-regular",
    iconFocused: "message-solid",
  },
  [Routes.CART]: {
    iconName: "cart-regular",
    iconFocused: "cart-solid",
  },
  [Routes.BOOKINGS]: {
    iconName: "bookings-regular",
    iconFocused: "bookings-solid",
  },
  [Routes.PROFILE]: {
    render: ({ focused, size }) => (
      <ProfileImage
        size={size}
        borderWidth={focused ? 1 : 0}
        borderColor={Colors.blue}
      />
    ),
  },
};

const renderTabIcons = (props, route) => {
  const { focused, size, color } = props;

  const iconSize = size - 3;

  const tabIcon = tabIcons[route.name];
  const { iconName, iconFocused, render } = tabIcon ?? {};

  return (
    <>
      <View
        style={{
          ...style.iconContainer,
          ...{ marginBottom: focused ? 5 : 9 },
          ...{ opacity: focused ? 1 : 0.4 },
        }}
      >
        {iconName ? (
          <Icon
            name={focused ? iconFocused : iconName}
            size={iconSize}
            color={color}
          />
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
};

const BottomTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        ...(colorScheme === "dark" ? darkThemeTabOptions : bottomTabOptions),
        tabBarIcon: (props) => renderTabIcons(props, route),
      })}
    >
      <Tabs.Screen
        name={Routes.HOME}
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
        <Tabs.Screen name={Routes.MESSAGES} component={Messages} />
        <Tabs.Screen name={Routes.CART} component={Cart} />
        <Tabs.Screen name={Routes.BOOKINGS} component={Bookings} />
        <Tabs.Screen name={Routes.PROFILE} component={Profile} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
};

export default BottomTabs;
