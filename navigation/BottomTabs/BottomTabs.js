import Icon from "@expo/vector-icons/Entypo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";

import style from "./BottomTabsStyles";
import AvatarSample from "../../components/AvatarSample/AvatarSample";
import Bookings from "../../screens/Bookings/Bookings";
import Home from "../../screens/Home/Home";
import Messages from "../../screens/Messages/Messages";
import Profile from "../../screens/Profile/Profile";
import Search from "../../screens/Search/Search";
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
  tabBarActiveTintColor: "black",
  tabBarInactiveTintColor: "black",
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

const renderTabIcons = ({ focused, color, size }, route) => {
  let iconName = "";
  switch (route.name) {
    case Routes.PROFILE:
      break;
    case Routes.HOME:
      iconName = "home";
      break;
    case Routes.MESSAGES:
      iconName = "message";
      break;
    case Routes.SEARCH:
      iconName = "magnifying-glass";
      break;
    case Routes.BOOKINGS:
      iconName = "calendar";
      break;
    default:
      iconName = "home";
  }
  return (
    <>
      <View
        style={{
          ...style.iconContainer,
          ...{ marginBottom: focused ? 5 : 9 },
          ...{ opacity: focused ? 1 : 0.4 },
        }}
      >
        {/* Show avatar on Profile tab icon */}
        {route.name === Routes.PROFILE ? (
          <AvatarSample fill="white" size={size} />
        ) : (
          // This is where the icon names are used
          <Icon name={iconName} color={color} size={size} />
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
  // const colorScheme = useColorScheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        // ...(colorScheme === "dark" ? darkThemeTabOptions : bottomTabOptions),
        ...bottomTabOptions,
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
        <Tabs.Screen name={Routes.SEARCH} component={Search} />
        <Tabs.Screen name={Routes.BOOKINGS} component={Bookings} />
        <Tabs.Screen name={Routes.PROFILE} component={Profile} />
      </Tabs.Group>
    </Tabs.Navigator>
  );
};

export default BottomTabs;
