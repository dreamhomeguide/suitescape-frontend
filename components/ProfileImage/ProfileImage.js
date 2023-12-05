import { Image } from "expo-image";
import React, { memo } from "react";

import style from "./ProfileImageStyles";

const ProfileImage = ({
  source = require("../../assets/images/profile.png"),
  size = 50,
  fillColor = "transparent",
  borderColor = "gray",
  borderWidth = 2,
  containerStyle,
}) => (
  <Image
    source={source}
    style={{
      ...style.container({ fillColor, borderColor, borderWidth, size }),
      ...containerStyle,
    }}
  />
);

export default memo(ProfileImage);
