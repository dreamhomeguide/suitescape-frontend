import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppFooterStyles";

const AppFooter = ({ children, enableBottomInset = true }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={style.footerContainer({
        bottomInsets: enableBottomInset ? insets.bottom : 0,
        bgColor: colors.background,
        borderColor: colors.border,
      })}
    >
      {children}
    </View>
  );
};

export default memo(AppFooter);
