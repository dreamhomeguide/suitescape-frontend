import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./VideoListingIconsViewStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { useSocialActions } from "../../contexts/SocialActionsContext";
import { Routes } from "../../navigation/Routes";
import ProfileImage from "../ProfileImage/ProfileImage";
import VideoListingIcon from "../VideoListingIcon/VideoListingIcon";

const VideoListingIconsView = ({ listingId, previewMode, onShowModal }) => {
  const navigation = useNavigation();
  const socialActionsContext = useSocialActions();

  const { isLiked, isSaved, likesCount, handleLike, handleSave } =
    socialActionsContext || {};

  const iconsConfig = [
    {
      IconComponent: AntDesign,
      name: "heart",
      label: likesCount,
      color: isLiked ? "red" : "white",
      onPress: handleLike,
    },
    {
      IconComponent: Foundation,
      name: "info",
      label: "View",
      onPress: () => navigation.navigate(Routes.LISTING_DETAILS, { listingId }),
      hapticEnabled: false,
    },
    {
      IconComponent: FontAwesome,
      name: "bookmark",
      label: isSaved ? "Saved" : "Save",
      color: isSaved ? "gold" : "white",
      onPress: handleSave,
    },
    {
      IconComponent: MaterialCommunityIcons,
      name: "format-list-bulleted-type",
      label: "Sections",
      onPress: onShowModal,
      enableOnPreview: true,
    },
  ];

  return (
    <View style={style.mainContainer}>
      {!previewMode && (
        <Pressable
          onPress={() =>
            navigation.navigate(Routes.PROFILE_HOST, { listingId })
          }
          style={({ pressed }) => pressedOpacity(pressed, 0.8)}
        >
          <ProfileImage fill="rgba(0,0,0,0.5)" size={35}>
            Profile
          </ProfileImage>
          <Text style={style.text}>Profile</Text>
        </Pressable>
      )}

      <>
        {iconsConfig
          .filter(
            (icon) => (previewMode && icon.enableOnPreview) || !previewMode,
          )
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
