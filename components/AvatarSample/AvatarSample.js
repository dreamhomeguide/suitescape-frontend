import React, { memo } from "react";
import { View } from "react-native";

import style from "./AvatarSampleStyles";

const AvatarSample = ({ size = 50, fill = "lightgray" }) => (
  <View
    style={{
      ...style.avatarContainer,
      ...(fill && { backgroundColor: fill }),
      ...(size && { width: size, height: size }),
    }}
  />
);

export default memo(AvatarSample);
