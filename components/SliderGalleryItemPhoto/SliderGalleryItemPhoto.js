import { Image } from "expo-image";
import React, { memo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  useWindowDimensions,
} from "react-native";

import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { useAuth } from "../../contexts/AuthContext";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import { baseURL } from "../../services/SuitescapeAPI";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const SliderGalleryItemPhoto = ({
  photoId,
  photoUrl,
  height = WINDOW_HEIGHT,
  modalMode,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const { showPhotoGallery } = useModalGallery();
  const { width } = useWindowDimensions();

  const imageResizeMode = modalMode ? "contain" : "cover";
  const { userToken } = useAuth();

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
          uri: baseURL + photoUrl,
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
};

export default memo(SliderGalleryItemPhoto);
