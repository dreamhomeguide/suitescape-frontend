import React, { memo, useCallback } from "react";
import { Modal, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./SliderModalVideoStyles";
import Fontello from "../../assets/fontello/Fontello";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import VideoFeed from "../VideoFeed/VideoFeed";

const SliderModalVideo = ({ videoData, visible, onClose, listing }) => {
  const insets = useSafeAreaInsets();
  const { isVideoGalleryShown, closeVideoGallery } = useModalGallery();

  const onRequestClose = useCallback(() => {
    onClose && onClose();
    closeVideoGallery();
  }, [onClose]);

  const showModal = visible || isVideoGalleryShown;

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
            ...style.closeButton({ topInsets: insets.top }),
            ...pressedOpacity(pressed),
          })}
        >
          <Fontello name="x-regular" size={20} color="white" />
        </Pressable>

        {showModal && (
          <GestureHandlerRootView style={globalStyles.flexFull}>
            <VideoFeed
              videos={videoData}
              currentListing={listing}
              scrollEnabled={videoData?.length > 1}
            />
          </GestureHandlerRootView>
        )}
      </View>
    </Modal>
  );
};

export default memo(SliderModalVideo);
