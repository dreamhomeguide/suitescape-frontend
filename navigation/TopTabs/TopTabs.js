import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  MaterialTabBar,
  MaterialTabItem,
} from "react-native-collapsible-tab-view";

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

const topTabOptions = {
  scrollEnabled: false,
  keepActiveTabCentered: true,
  labelStyle: style.label,
  tabStyle: style.item,
  indicatorStyle: style.indicator,
  activeColor: Colors.blue,
  inactiveColor: Colors.gray,
};

export const TabBar = ({ defaultProps, ...customProps }) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [pressedTab, setPressedTab] = useState(null);

  const timeoutRef = useRef(null);

  const { colors } = useTheme();

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  return (
    <MaterialTabBar
      {...defaultProps}
      {...topTabOptions}
      contentContainerStyle={{ backgroundColor: colors.background }}
      TabItemComponent={(props) => (
        <MaterialTabItem
          {...props}
          labelStyle={{
            ...topTabOptions.labelStyle,
            ...(customProps.fontSize && { fontSize: customProps.fontSize }),
          }}
          onPress={(name) => {
            setIsSwitching(true);
            setPressedTab(name);

            props.onPress(name);

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsSwitching(false);
            }, 350);
          }}
          pressOpacity={0.5}
          // pressColor={Colors.lightblue}
          android_ripple={{ radius: 0 }}
          activeColor={
            isSwitching && props.name !== pressedTab ? Colors.gray : Colors.blue
          }
        />
      )}
      {...customProps}
    />
  );
};
