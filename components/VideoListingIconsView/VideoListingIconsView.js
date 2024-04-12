import { useNavigation } from "@react-navigation/native";
import React, { memo, useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";

import style from "./VideoListingIconsViewStyles";
import Fontello from "../../assets/fontello/Fontello";
import useSocialActions from "../../hooks/useSocialActions";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import ProfileImage from "../ProfileImage/ProfileImage";
import VideoListingIcon from "../VideoListingIcon/VideoListingIcon";

const VideoListingIconsView = ({
  hostId,
  hostPictureUrl,
  listingId,
  previewMode,
  onShowModal,
}) => {
  const navigation = useNavigation();
  const { isLiked, isSaved, likesCount, handleLike, handleSave } =
    useSocialActions(listingId, true);

  const renderProfileImage = useCallback(
    () => (
      <ProfileImage
        source={hostPictureUrl ? { uri: baseURL + hostPictureUrl } : null}
        fillColor="transparent"
        borderColor="white"
        borderWidth={1}
        size={35}
      />
    ),
    [hostPictureUrl],
  );

  const iconsConfig = useMemo(
    () => [
      {
        label: "Profile",
        renderIcon: renderProfileImage,
        onPress: () => navigation.navigate(Routes.PROFILE_HOST, { hostId }),
      },
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
        onPress: () =>
          navigation.navigate(Routes.LISTING_DETAILS, { listingId }),
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
    ],
    [
      hostId,
      listingId,
      isLiked,
      isSaved,
      likesCount,
      handleLike,
      handleSave,
      navigation,
      renderProfileImage,
    ],
  );

  const filteredIcons = useMemo(() => {
    return iconsConfig.filter((icon) => !previewMode || icon.enableOnPreview);
  }, [iconsConfig, previewMode]);

  const renderItem = useCallback(({ item: config }) => {
    return <VideoListingIcon {...config} />;
  }, []);

  return (
    <View style={style.container}>
      <FlatList
        data={filteredIcons}
        keyExtractor={(_, index) => "listing-icon-" + index}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
};

export default memo(VideoListingIconsView);
