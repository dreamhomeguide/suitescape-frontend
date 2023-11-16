import React, { memo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppFooterStyles";

const AppFooter = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        ...style.footerContainer,
        paddingBottom: insets.bottom + 10,
      }}
    >
      {children}
    </View>
  );
};

export default memo(AppFooter);
