import React, { memo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./HeaderIconStyles";

const HeaderIcon = ({ children, right = false }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        top: insets.top + 25,
        ...(right && { right: 0 }),
        ...style.headerIconContainer,
      }}
    >
      {children}
    </View>
  );
};

export default memo(HeaderIcon);
