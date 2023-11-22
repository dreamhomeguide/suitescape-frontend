import React, { memo, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";

import style from "./SliderGalleryModeStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import ButtonGalleryMode from "../ButtonGalleryMode/ButtonGalleryMode";
import SliderGallery from "../SliderGallery/SliderGallery";

const SliderGalleryMode = ({ imageData, videoData }) => {
  const [isPhoto, setIsPhoto] = useState(videoData?.length === 0);

  const { index, setIndex, isPhotoGalleryShown, isVideoGalleryShown } =
    useModalGallery();
  const { height } = useWindowDimensions();

  const sliderHeight = height / 2 - 50;
  const galleryData = isPhoto ? imageData : videoData;
  const mediaType = isPhoto ? "image" : "video";

  const changeGalleryMode = (mode) => {
    setIsPhoto(mode === "image");
    setIndex(0);
  };

  return (
    <View style={style.mainContainer({ height: sliderHeight })}>
      {!isPhotoGalleryShown && !isVideoGalleryShown && (
        <SliderGallery
          data={galleryData}
          mediaType={mediaType}
          height={sliderHeight}
        />
      )}

      {/* Index */}
      {galleryData?.length > 0 ? (
        <View style={style.indexContainer}>
          <Text style={style.text}>
            {index + 1}/{galleryData.length}
          </Text>
        </View>
      ) : null}

      {/* Mode Buttons */}
      {imageData && videoData && (
        <View style={style.modeContainer}>
          <ButtonGalleryMode
            mode="video"
            isPhoto={isPhoto}
            setGalleryMode={changeGalleryMode}
          />
          <ButtonGalleryMode
            mode="image"
            isPhoto={isPhoto}
            setGalleryMode={changeGalleryMode}
          />
        </View>
      )}
    </View>
  );
};

export default memo(SliderGalleryMode);
