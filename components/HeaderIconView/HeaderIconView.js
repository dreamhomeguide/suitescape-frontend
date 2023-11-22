import React, { memo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./HeaderIconViewStyles";

const HeaderIconView = ({ children, right = false }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={style.headerIconContainer({ topInsets: insets.top, right })}>
      {children}
    </View>
  );
};

export default memo(HeaderIconView);
