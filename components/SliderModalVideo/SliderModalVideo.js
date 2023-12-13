import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./SliderModalVideoStyles";
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
        <Ionicons
          name="close"
          size={30}
          color="white"
          style={style.closeButton({ topInsets: insets.top })}
          onPress={() => closeVideoGallery()}
        />

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
