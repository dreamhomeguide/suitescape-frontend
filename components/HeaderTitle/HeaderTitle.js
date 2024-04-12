import React, { memo } from "react";
import { Animated, Text } from "react-native";

import style from "./HeaderTitleStyles";

const HeaderTitle = ({ children, containerStyle, textStyle }) => {
  return (
    <Animated.View style={{ ...style.container, ...containerStyle }}>
      <Text style={{ ...style.text, ...textStyle }}>{children}</Text>
    </Animated.View>
  );
};

export default memo(HeaderTitle);
