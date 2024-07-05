import React, { memo, useState } from "react";
import { Text, View } from "react-native";

import style from "./SliderGalleryModeStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import ButtonGalleryMode from "../ButtonGalleryMode/ButtonGalleryMode";
import SliderGallery from "../SliderGallery/SliderGallery";

const SliderGalleryMode = ({
  imageData,
  videoData,
  height,
  showIndex = true,
  showMode = true,
}) => {
  const [isPhoto, setIsPhoto] = useState(!videoData || videoData.length === 0);

  const { index, setIndex, isPhotoGalleryShown, isVideoGalleryShown } =
    useModalGallery();

  const galleryData = isPhoto ? imageData : videoData;
  const mediaType = isPhoto ? "image" : "video";

  const changeGalleryMode = (mode) => {
    setIsPhoto(mode === "image");
    setIndex(0);
  };

  return (
    <View style={{ height }}>
      {!isPhotoGalleryShown && !isVideoGalleryShown && (
        <SliderGallery
          data={galleryData}
          mediaType={mediaType}
          height={height}
        />
      )}

      {/* Index */}
      {showIndex && galleryData?.length > 0 ? (
        <View style={style.indexContainer}>
          <Text style={style.text}>
            {index + 1}/{galleryData.length}
          </Text>
        </View>
      ) : null}

      {/* Mode Buttons */}

      {showMode && (
        <View style={style.modeContainer}>
          {videoData?.length > 0 && (
            <ButtonGalleryMode
              mode="video"
              isPhoto={isPhoto}
              setGalleryMode={changeGalleryMode}
            />
          )}

          {imageData?.length > 0 && (
            <ButtonGalleryMode
              mode="image"
              isPhoto={isPhoto}
              setGalleryMode={changeGalleryMode}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default memo(SliderGalleryMode);
