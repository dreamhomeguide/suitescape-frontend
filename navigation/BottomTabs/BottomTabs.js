import Entypo from "@expo/vector-icons/Entypo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useColorScheme, View } from "react-native";

import style from "./BottomTabsStyles";
import { Colors } from "../../assets/Colors";
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
    iconName: "home",
  },
  [Routes.MESSAGES]: {
    iconName: "message",
  },
  [Routes.CART]: {
    iconName: "shopping-cart",
  },
  [Routes.BOOKINGS]: {
    iconName: "calendar",
  },
  [Routes.PROFILE]: {
    render: ({ size }) => (
      <ProfileImage borderColor="transparent" borderWidth={0} size={size} />
    ),
  },
};

const renderTabIcons = (props, route) => {
  const { focused, color, size } = props;

  const tabIcon = tabIcons[route.name];
  const { iconName, render } = tabIcon ?? {};

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
          <Entypo name={iconName} size={size} color={color} />
        ) : (
          render(props)
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
