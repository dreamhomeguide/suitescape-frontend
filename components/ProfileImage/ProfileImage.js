import { Image } from "expo-image";
import React, { memo } from "react";

import style from "./ProfileImageStyles";

const ProfileImage = ({
  source = require("../../assets/images/pngs/profile.png"),
  size = 50,
  fillColor = "transparent",
  borderColor = "gray",
  borderWidth = 0,
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
