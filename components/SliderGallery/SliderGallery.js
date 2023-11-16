import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo, useCallback } from "react";
import { Dimensions, View } from "react-native";

import style from "./SliderGalleryStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import Slider from "../Slider/Slider";
import SliderGalleryItem from "../SliderGalleryItem/SliderGalleryItem";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const SliderGallery = ({ data, mediaType, height }) => {
  const { index, setIndex } = useModalGallery();

  const sliderIndex = index < data?.length && index > 0 ? index : 0;

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SliderGalleryItem
          mediaId={item.id}
          mediaUrl={item.url}
          mediaFileName={item.filename}
          type={mediaType}
          height={height}
          // modalMode={modalMode}
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
      scrollEnabled={data?.length > 1}
      ListEmptyComponent={
        <View
          style={{
            width: WINDOW_WIDTH,
            ...style.emptyContainer,
          }}
        >
          <Ionicons name="image" size={50} color="white" />
        </View>
      }
    />
  );
};

export default memo(SliderGallery);
