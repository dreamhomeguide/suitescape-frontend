import React, { memo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppFooterStyles";

const AppFooter = ({ children, enableBottomInset = true }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        ...style.footerContainer,
        paddingBottom: (enableBottomInset ? insets.bottom : 0) + 12,
      }}
    >
      {children}
    </View>
  );
};

export default memo(AppFooter);
