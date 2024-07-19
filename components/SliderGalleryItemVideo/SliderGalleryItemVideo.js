import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import React, { memo, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import style from "./SliderGalleryItemVideoStyles";
import globalStyles, { pressedBgColor } from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import useCachedMedia from "../../hooks/useCachedMedia";
import { baseURL } from "../../services/SuitescapeAPI";
import VideoItem from "../VideoItem/VideoItem";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const SliderGalleryItemVideo = ({
  videoId,
  videoUrl,
  filename,
  privacy,
  isTranscoded,
  height = WINDOW_HEIGHT,
  ...props
}) => {
  const videoRef = useRef(null);

  const { isVideoGalleryShown, showVideoGallery } = useModalGallery();
  const { width } = useWindowDimensions();

  const fileExtension = filename?.split(".").pop();

  const { cachedUri } = useCachedMedia(
    "videos/",
    videoId + "." + fileExtension,
    isTranscoded && baseURL + videoUrl,
  );

  // Pauses the video when the user navigates to the next screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.setIsClickPaused(true);
          videoRef.current.setIsClickMuted(false);
        }
      };
    }, []),
  );

  return (
    <>
      <VideoItem
        ref={videoRef}
        videoUri={cachedUri}
        height={height}
        width={width}
        iconSize={40}
        initialIsMuted={isTranscoded}
        shouldPlay={!isVideoGalleryShown}
        likeEnabled={false}
        clearModeEnabled={false}
        {...props}
      />

      {privacy === "private" && (
        <View style={globalStyles.disabledBackground} />
      )}

      {!isTranscoded && (
        <View style={style.transcodingContainer}>
          <ActivityIndicator size="large" />
          <Text>Processing...</Text>
        </View>
      )}

      {/* Fullscreen button for video */}
      <Pressable
        onPress={() => showVideoGallery()}
        style={({ pressed }) => ({
          ...style.fullScreenButton,
          ...pressedBgColor(pressed, "rgba(0,0,0,0.8)"),
        })}
      >
        <MaterialCommunityIcons name="fullscreen" size={20} color="white" />
      </Pressable>
    </>
  );
};

export default memo(SliderGalleryItemVideo);
