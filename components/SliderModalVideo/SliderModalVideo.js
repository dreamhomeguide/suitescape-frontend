import React, { memo } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./SliderModalVideoStyles";
import Fontello from "../../assets/fontello/Fontello";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import VideoFeed from "../VideoFeed/VideoFeed";

const SliderModalVideo = ({ videoData, listing }) => {
  const { isVideoGalleryShown, closeVideoGallery } = useModalGallery();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={isVideoGalleryShown}
      animationType="slide"
      onRequestClose={() => closeVideoGallery()}
      statusBarTranslucent
    >
      <View style={style.mainContainer}>
        <Pressable
          onPress={() => closeVideoGallery()}
          style={({ pressed }) => ({
            ...pressedOpacity(pressed),
            ...style.closeButton({ topInsets: insets.top }),
          })}
        >
          <Fontello name="x-regular" size={20} color="white" />
        </Pressable>

        {isVideoGalleryShown && (
          <VideoFeed
            videos={videoData}
            currentListing={listing}
            scrollEnabled={videoData?.length > 1}
          />
        )}
      </View>
    </Modal>
  );
};

export default memo(SliderModalVideo);
