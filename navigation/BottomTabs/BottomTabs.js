import React from "react";
import { View } from "react-native";

import style from "./GuestTabsStyles";
import { Colors } from "../../assets/Colors";
import Icon from "../../assets/fontello/Fontello";
import IconBadge from "../../components/IconBadge/IconBadge";
import ProfileImage from "../../components/ProfileImage/ProfileImage";

export const tabBarStyle = {
  backgroundColor: "white",
  minHeight: 60,
  borderTopWidth: 0,
};

export const bottomTabOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarActiveTintColor: Colors.blue,
  tabBarInactiveTintColor: Colors.lightblue,
  tabBarStyle,
};

export const darkThemeTabOptions = {
  ...bottomTabOptions,
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: "white",
  tabBarStyle: {
    ...tabBarStyle,
    backgroundColor: "black",
  },
};

export const renderProfileImage = (profilePicture, { focused, size }) => (
  <ProfileImage
    source={profilePicture}
    size={size}
    borderWidth={focused ? 1 : 0}
    borderColor={Colors.blue}
  />
);

export const renderTabIcons = (tabIcons, props, route) => {
  const { focused, size, color } = props;
  const iconSize = size - 3;
  const tabIcon = tabIcons[route.name];
  const { iconName, iconFocused, badge, render } = tabIcon ?? {};

  if (!iconName && !render) {
    return null;
  }

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
          <IconBadge count={badge}>
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
};
