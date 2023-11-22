import React from "react";
import { Pressable, Text } from "react-native";

import style from "./ButtonGalleryModeStyles";

const ButtonGalleryMode = ({ mode, isPhoto, setGalleryMode }) => {
  const isPhotoMode = mode === "image";
  const isActive = isPhotoMode ? isPhoto : !isPhoto;

  return (
    <Pressable
      onPress={() => setGalleryMode(mode)}
      style={style.button({ isActive })}
    >
      <Text style={style.text}>{isPhotoMode ? "Image" : "Video"}</Text>
    </Pressable>
  );
};

export default ButtonGalleryMode;
