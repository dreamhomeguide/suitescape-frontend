import { Image } from "expo-image";
import React, { memo, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./HeaderProfileHostStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import { baseURL } from "../../services/SuitescapeAPI";
import ProfileImage from "../ProfileImage/ProfileImage";
import SliderModalPhoto from "../SliderModalPhoto/SliderModalPhoto";

const HeaderProfileHost = ({
  height: headerHeight,
  hostName,
  hostPictureUrl,
  userName,
  listingsCount,
  likesCount,
  reviewsCount,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const coverHeight = headerHeight / 2 - 15;

  const hostPicture = useMemo(
    () => [{ uri: baseURL + hostPictureUrl }],
    [hostPictureUrl],
  );

  return (
    <>
      <View style={{ height: headerHeight }} pointerEvents="box-none">
        <Image
          source={require("../../assets/images/onboarding/page1.png")}
          transition={100}
          style={{ height: coverHeight, ...style.coverImageContainer }}
        />
        <View style={style.mainContentContainer} pointerEvents="box-none">
          <Pressable
            pointerEvents={showImageModal ? "none" : "box-none"}
            onPress={() => setShowImageModal(true)}
            style={({ pressed }) => ({
              zIndex: 1,
              ...pressedOpacity(pressed),
            })}
          >
            <ProfileImage
              source={hostPictureUrl ? { uri: baseURL + hostPictureUrl } : null}
              size={160}
              fillColor="white"
              borderColor="white"
              borderWidth={5}
              containerStyle={style.profileImageContainer}
            />
          </Pressable>
          <View style={style.contentContainer} pointerEvents="box-none">
            <View style={style.nameContainer} pointerEvents="none">
              <Text style={style.hostName}>{hostName ?? "Loading..."}</Text>
              <Text style={style.userName}>
                {"@" + (!userName ? "" : userName.replaceAll(" ", ""))}
              </Text>
            </View>
            <View style={style.overviewContainer} pointerEvents="none">
              <View style={style.overviewItemContainer}>
                <Text style={style.overviewItemCount}>{listingsCount}</Text>
                <Text style={style.overviewItemLabel}>Listings</Text>
              </View>
              <View style={globalStyles.verticalDivider} />
              <View style={style.overviewItemContainer}>
                <Text style={style.overviewItemCount}>{likesCount}</Text>
                <Text style={style.overviewItemLabel}>Likes</Text>
              </View>
              <View style={globalStyles.verticalDivider} />
              <View style={style.overviewItemContainer}>
                <Text style={style.overviewItemCount}>{reviewsCount}</Text>
                <Text style={style.overviewItemLabel}>Reviews</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <SliderModalPhoto
        imageData={hostPicture}
        visible={showImageModal}
        onClose={() => setShowImageModal(false)}
        showIndex={false}
      />
    </>
  );
};

export default memo(HeaderProfileHost);
