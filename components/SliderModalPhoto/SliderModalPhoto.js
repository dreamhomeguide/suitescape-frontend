import { Image } from "expo-image";
import React, { memo, useCallback, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import Gallery from "react-native-awesome-gallery";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./SliderModalPhotoStyles";
import Fontello from "../../assets/fontello/Fontello";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import SliderGalleryItemPhoto from "../SliderGalleryItemPhoto/SliderGalleryItemPhoto";

const SliderModalPhoto = ({
  imageData, // You only need this to use the useModalGallery hook
  visible,
  onClose,
  galleryMode,
  showIndex,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);

  const insets = useSafeAreaInsets();
  const { index, setIndex, isPhotoGalleryShown, closePhotoGallery } =
    useModalGallery();

  const renderItem = useCallback(
    ({ item }) => (
      <>
        <ActivityIndicator
          animating={isImageLoading}
          style={globalStyles.absoluteCenter}
        />
        <Image
          source={item}
          contentFit="contain"
          style={globalStyles.flexFull}
          onLayout={() => setIsImageLoading(true)}
          onLoadEnd={() => setIsImageLoading(false)}
        />
      </>
    ),
    [isImageLoading],
  );

  const renderGalleryItem = useCallback(({ item, setImageDimensions }) => {
    return (
      <SliderGalleryItemPhoto
        modalMode
        photoId={item.id}
        photoUrl={item.url}
        enableLiveTextInteraction
        onLoad={(e) => {
          const { width, height } = e.source;
          setImageDimensions({ width, height });
        }}
      />
    );
  }, []);

  const onRequestClose = useCallback(() => {
    onClose && onClose();
    if (galleryMode) {
      closePhotoGallery();
    }
  }, [galleryMode, onClose]);

  const renderIndex = useCallback(() => {
    if (!showIndex || !imageData || !Array.isArray(imageData)) {
      return null;
    }

    return (
      <View style={style.indexContainer({ bottomInsets: insets.bottom })}>
        <Text style={style.text}>
          {index + 1}/{imageData.length}
        </Text>
      </View>
    );
  }, [imageData, index, insets]);

  const showModal = visible || isPhotoGalleryShown;

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={style.mainContainer}>
        <Pressable
          onPress={onRequestClose}
          style={({ pressed }) => ({
            ...pressedOpacity(pressed),
            ...style.closeButton({ topInsets: insets.top }),
          })}
        >
          <Fontello name="x-regular" size={20} color="white" />
        </Pressable>

        {showModal && (
          <GestureHandlerRootView style={globalStyles.flexFull}>
            <Gallery
              data={imageData}
              keyExtractor={(item, index) => item.id ?? index.toString()}
              initialIndex={galleryMode ? index : 0}
              onIndexChange={galleryMode ? setIndex : null}
              renderItem={galleryMode ? renderGalleryItem : renderItem}
              onSwipeToClose={onRequestClose}
              disableSwipeUp
            />
          </GestureHandlerRootView>
        )}

        {/*<SliderGallery data={imageData} mediaType="image" modalMode />*/}
      </View>

      {renderIndex()}
    </Modal>
  );
};

export default memo(SliderModalPhoto);
