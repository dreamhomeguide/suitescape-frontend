import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import {
  MaterialTabBar,
  MaterialTabItem,
} from "react-native-collapsible-tab-view";
import { useAnimatedStyle } from "react-native-reanimated";

import style from "./TopTabsStyles";
import { Colors } from "../../assets/Colors";

// export const topTabOptions = {
//   tabBarScrollEnabled: true,
//   tabBarBounces: false,
//   tabBarActiveTintColor: Colors.blue,
//   tabBarInactiveTintColor: "rgba(0,0,0,0.3)",
//   tabBarIndicatorStyle: { backgroundColor: Colors.blue },
//   tabBarLabelStyle: style.label,
//   tabBarItemStyle: style.item,
//   tabBarPressColor: Colors.lightgray,
//   tabBarPressOpacity: 0.6,
//   tabBarGap: 10,
// };

export const topTabOptions = {
  scrollEnabled: false,
  keepActiveTabCentered: true,
  labelStyle: style.label,
  tabStyle: style.item,
  indicatorStyle: style.indicator,
  activeColor: Colors.blue,
  inactiveColor: Colors.gray,
};

export const TabItem = memo(({ defaultProps, ...customProps }) => {
  const animatedLabelStyle = useAnimatedStyle(() => {
    if (defaultProps.indexDecimal.value % 1 !== 0) {
      return {
        color: Colors.gray,
      };
    }
    return {};
  });

  return (
    <MaterialTabItem
      {...defaultProps}
      labelStyle={[
        animatedLabelStyle,
        topTabOptions.labelStyle,
        customProps.fontSize && { fontSize: customProps.fontSize },
      ]}
      activeColor={Colors.blue}
      pressOpacity={0.5}
      android_ripple={{ radius: 0 }}
    />
  );
});

export const TabBar = memo(({ defaultProps, ...customProps }) => {
  const { colors } = useTheme();

  return (
    <MaterialTabBar
      {...defaultProps}
      {...topTabOptions}
      contentContainerStyle={{ backgroundColor: colors.background }}
      TabItemComponent={(props) => (
        <TabItem defaultProps={props} {...customProps} />
      )}
      {...customProps}
    />
  );
});
