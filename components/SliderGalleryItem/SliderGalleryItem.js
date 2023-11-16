import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  useWindowDimensions,
} from "react-native";

import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { useAuth } from "../../contexts/AuthContext";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import { baseURLWithoutApi } from "../../services/SuitescapeAPI";
import VideoItem from "../VideoItem/VideoItem";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const SliderGalleryItem = ({
  mediaId,
  mediaUrl,
  mediaFileName,
  height = WINDOW_HEIGHT,
  type,
  modalMode,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef(null);

  const { isVideoGalleryShown, showPhotoGallery, showVideoGallery } =
    useModalGallery();
  const { width } = useWindowDimensions();

  const fileExtension = mediaFileName?.split(".").pop();
  const imageResizeMode = modalMode ? "contain" : "cover";
  const { userToken } = useAuth();

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

  if (type === "image") {
    return (
      <Pressable
        disabled={modalMode}
        style={({ pressed }) => ({
          height,
          width,
          ...pressedOpacity(pressed, 0.7),
        })}
        onPress={() => showPhotoGallery()}
      >
        {isLoading && <ActivityIndicator style={globalStyles.absoluteCenter} />}
        <Image
          source={{
            uri: baseURLWithoutApi + mediaUrl,
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }}
          contentFit={imageResizeMode}
          onLoadEnd={() => setIsLoading(false)}
          style={globalStyles.flexFull}
          {...props}
        />
      </Pressable>
    );
  }

  if (type === "video") {
    return (
      <>
        <VideoItem
          ref={videoRef}
          videoId={mediaId}
          videoUrl={mediaUrl}
          fileExtension={fileExtension}
          height={height}
          width={width}
          iconSize={40}
          initialIsMuted
          shouldPlay={!isVideoGalleryShown}
          {...props}
        />

        {/* Fullscreen button for video */}
        <Pressable
          onPress={() => showVideoGallery()}
          style={({ pressed }) => ({
            position: "absolute",
            bottom: 15,
            left: 20,
            borderRadius: 20,
            padding: 5,
            backgroundColor: "rgba(0,0,0,0.5)",
            ...(pressed && { backgroundColor: "rgba(0,0,0,0.8)" }),
          })}
        >
          <MaterialCommunityIcons name="fullscreen" size={20} color="white" />
        </Pressable>
      </>
    );
  }

  return null;
};

export default memo(SliderGalleryItem);
