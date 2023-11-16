import React from "react";
import { Pressable, Text } from "react-native";

import style from "./ButtonGalleryModeStyles";

const ButtonGalleryMode = ({ mode, isPhoto, setGalleryMode }) => {
  const isPhotoMode = mode === "image";
  const isActive = isPhotoMode ? isPhoto : !isPhoto;

  const buttonStyle = {
    ...style.button,
    backgroundColor: isActive ? "rgba(0,0,0,0.5)" : undefined,
    opacity: isActive ? undefined : 0.6,
  };

  return (
    <Pressable onPress={() => setGalleryMode(mode)} style={buttonStyle}>
      <Text style={style.text}>{isPhotoMode ? "Image" : "Video"}</Text>
    </Pressable>
  );
};

export default ButtonGalleryMode;
