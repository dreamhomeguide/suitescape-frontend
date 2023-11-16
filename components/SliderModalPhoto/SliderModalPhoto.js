import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { Modal, Text, View } from "react-native";
import Gallery from "react-native-awesome-gallery";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./SliderModalPhotoStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import SliderGalleryItem from "../SliderGalleryItem/SliderGalleryItem";

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
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Ionicons
          name="close"
          size={30}
          color="white"
          style={{
            ...globalStyles.closeModalButton,
            top: insets.top + 15,
          }}
          onPress={() => closePhotoGallery()}
        />

        {isPhotoGalleryShown && (
          <GestureHandlerRootView>
            <Gallery
              data={imageData}
              renderItem={({ item, setImageDimensions }) => {
                return (
                  <SliderGalleryItem
                    mediaId={item.id}
                    mediaUrl={item.url}
                    type="image"
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
        <View
          style={{
            ...style.indexContainer,
            bottom: insets.bottom + 15,
          }}
        >
          <Text style={style.text}>
            {index + 1}/{imageData.length}
          </Text>
        </View>
      ) : null}
    </Modal>
  );
};

export default memo(SliderModalPhoto);
