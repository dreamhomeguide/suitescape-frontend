import { useTheme } from "@react-navigation/native";
import React, { memo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppFooterStyles";

const AppFooter = ({
  children,
  containerStyle,
  transparent = false,
  enableBottomInset = true,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={{
        ...style.mainContainer({
          enableInsets: enableBottomInset,
          bottomInsets: insets.bottom,
        }),
        ...(transparent ? style.transparentFooter : style.footer({ colors })),
        ...containerStyle,
      }}
    >
      {children}
    </View>
  );
};

export default memo(AppFooter);
