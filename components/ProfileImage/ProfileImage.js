import { Image } from "expo-image";
import React, { memo } from "react";

import style from "./ProfileImageStyles";
import { Colors } from "../../assets/Colors";

const ProfileImage = ({
  source,
  size = 50,
  fillColor = Colors.lightgray,
  borderColor = "gray",
  borderWidth = 0,
  containerStyle,
  ...props
}) => {
  return (
    <Image
      source={source ?? require("../../assets/images/pngs/default-profile.png")}
      transition={100}
      style={{
        ...style.container({ fillColor, borderColor, borderWidth, size }),
        ...containerStyle,
      }}
      {...props}
    />
  );
};

export default memo(ProfileImage);
