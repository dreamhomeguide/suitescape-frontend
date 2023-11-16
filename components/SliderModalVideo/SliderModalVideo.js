import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
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
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Ionicons
          name="close"
          size={30}
          color="white"
          style={{
            ...globalStyles.closeModalButton,
            top: insets.top + 15,
          }}
          onPress={() => closeVideoGallery()}
        />

        {isVideoGalleryShown && (
          <VideoFeed videos={videoData} currentListing={listing} />
        )}
      </View>
    </Modal>
  );
};

export default memo(SliderModalVideo);
