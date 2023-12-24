import React, { memo } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Gallery from "react-native-awesome-gallery";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./SliderModalPhotoStyles";
import Fontello from "../../assets/fontello/Fontello";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import SliderGalleryItemPhoto from "../SliderGalleryItemPhoto/SliderGalleryItemPhoto";

const SliderModalPhoto = ({ imageData }) => {
  const { index, setIndex, isPhotoGalleryShown, closePhotoGallery } =
    useModalGallery();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={isPhotoGalleryShown}
      animationType="slide"
      onRequestClose={() => closePhotoGallery()}
      statusBarTranslucent
    >
      <View style={style.mainContainer}>
        <Pressable
          onPress={() => closePhotoGallery()}
          style={({ pressed }) => ({
            ...pressedOpacity(pressed),
            ...style.closeButton({ topInsets: insets.top }),
          })}
        >
          <Fontello name="x-regular" size={20} color="white" />
        </Pressable>

        {isPhotoGalleryShown && (
          <GestureHandlerRootView style={globalStyles.flexFull}>
            <Gallery
              data={imageData}
              renderItem={({ item, setImageDimensions }) => {
                return (
                  <SliderGalleryItemPhoto
                    photoId={item.id}
                    photoUrl={item.url}
                    modalMode
                    onLoad={(e) => {
                      const { width, height } = e.source;
                      setImageDimensions({ width, height });
                    }}
                  />
                );
              }}
              initialIndex={index}
              onIndexChange={setIndex}
              onSwipeToClose={() => closePhotoGallery()}
              disableSwipeUp
            />
          </GestureHandlerRootView>
        )}

        {/*<SliderGallery data={imageData} mediaType="image" modalMode />*/}
      </View>

      {/* Index */}
      {imageData ? (
        <View style={style.indexContainer({ bottomInsets: insets.bottom })}>
          <Text style={style.text}>
            {index + 1}/{imageData.length}
          </Text>
        </View>
      ) : null}
    </Modal>
  );
};

export default memo(SliderModalPhoto);
