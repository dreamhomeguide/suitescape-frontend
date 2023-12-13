import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo, useCallback } from "react";
import { Dimensions, View } from "react-native";

import style from "./SliderGalleryStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import Slider from "../Slider/Slider";
import SliderGalleryItemPhoto from "../SliderGalleryItemPhoto/SliderGalleryItemPhoto";
import SliderGalleryItemVideo from "../SliderGalleryItemVideo/SliderGalleryItemVideo";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const SliderGallery = ({ data, mediaType, height }) => {
  const { index, setIndex } = useModalGallery();

  const sliderIndex = index < data?.length && index > 0 ? index : 0;

  const renderItem = useCallback(
    ({ item }) => {
      return mediaType === "image" ? (
        <SliderGalleryItemPhoto
          photoId={item.id}
          photoUrl={item.url}
          height={height}
        />
      ) : (
        <SliderGalleryItemVideo
          videoId={item.id}
          videoUrl={item.url}
          filename={item.filename}
          height={height}
        />
      );
    },
    [mediaType],
  );

  return (
    <Slider
      index={sliderIndex}
      onIndexChange={setIndex}
      data={data}
      width={WINDOW_WIDTH}
      windowSize={3}
      initialNumToRender={3}
      bounces
      renderItem={renderItem}
      // scrollEnabled={data?.length > 1}
      ListEmptyComponent={
        <View style={style.emptyContainer({ width: WINDOW_WIDTH })}>
          <Ionicons name="image" size={50} color="white" />
        </View>
      }
    />
  );
};

export default memo(SliderGallery);
