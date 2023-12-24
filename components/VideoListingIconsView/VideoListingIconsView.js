import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./VideoListingIconsViewStyles";
import Fontello from "../../assets/fontello/Fontello";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { useSocialActions } from "../../contexts/SocialActionsContext";
import { Routes } from "../../navigation/Routes";
import ProfileImage from "../ProfileImage/ProfileImage";
import VideoListingIcon from "../VideoListingIcon/VideoListingIcon";

const VideoListingIconsView = ({
  hostId,
  listingId,
  previewMode,
  onShowModal,
}) => {
  const navigation = useNavigation();
  const socialActionsContext = useSocialActions();

  const { isLiked, isSaved, likesCount, handleLike, handleSave } =
    socialActionsContext || {};

  const iconsConfig = [
    {
      IconComponent: Fontello,
      name: "heart-solid",
      label: likesCount,
      color: isLiked ? "red" : "white",
      onPress: handleLike,
    },
    {
      IconComponent: Fontello,
      name: "info-solid",
      label: "View",
      onPress: () => navigation.navigate(Routes.LISTING_DETAILS, { listingId }),
      hapticEnabled: false,
    },
    {
      IconComponent: Fontello,
      name: "save-solid",
      label: isSaved ? "Saved" : "Save",
      color: isSaved ? "gold" : "white",
      onPress: handleSave,
    },
    {
      IconComponent: Fontello,
      name: "section-solid",
      label: "Sections",
      onPress: onShowModal,
      enableOnPreview: true,
    },
  ];

  return (
    <View style={style.mainContainer}>
      {!previewMode && (
        <Pressable
          onPress={() => navigation.navigate(Routes.PROFILE_HOST, { hostId })}
          style={({ pressed }) => pressedOpacity(pressed, 0.8)}
        >
          <ProfileImage borderWidth={1} borderColor="white" size={35}>
            Profile
          </ProfileImage>
          <Text style={style.text}>Profile</Text>
        </Pressable>
      )}

      <>
        {iconsConfig
          .filter((icon) => !previewMode || icon.enableOnPreview)
          .map((config, index) => (
            <View key={index}>
              <VideoListingIcon {...config} />
              <Text style={style.text}>{config.label}</Text>
            </View>
          ))}
      </>
    </View>
  );
};

export default memo(VideoListingIconsView);
