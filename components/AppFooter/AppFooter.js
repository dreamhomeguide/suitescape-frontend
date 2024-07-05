import { useTheme } from "@react-navigation/native";
import React, { memo, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./AppFooterStyles";

const AppFooter = ({
  children,
  containerStyle,
  transparent = false,
  enableBottomInset = true,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(
    Keyboard.isVisible(),
  );

  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  useEffect(() => {
    const didShowSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(Keyboard.isVisible());
    });

    const didHideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(Keyboard.isVisible());
    });

    return () => {
      didShowSubscription.remove();
      didHideSubscription.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

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
