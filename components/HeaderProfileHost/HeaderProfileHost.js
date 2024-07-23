import { Image } from "expo-image";
import React, { memo, useCallback, useState } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import style from "./HeaderProfileHostStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { baseURL } from "../../services/SuitescapeAPI";
import ProfileImage from "../ProfileImage/ProfileImage";
import SliderModalPhoto from "../SliderModalPhoto/SliderModalPhoto";
import StarRatingView from "../StarRatingView/StarRatingView";

const HeaderProfileHost = ({
  height: headerHeight,
  hostName,
  hostProfileUrl,
  hostCoverUrl,
  listingsAvgRating,
  listingsCount,
  likesCount,
  reviewsCount,
}) => {
  const [modalImage, setModalImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const coverHeight = headerHeight / 2 - 15;

  const onCoverPress = useCallback(() => {
    setModalImage({ uri: baseURL + hostCoverUrl });
    setShowImageModal(true);
  }, [hostCoverUrl]);

  const onProfilePress = useCallback(() => {
    setModalImage({ uri: baseURL + hostProfileUrl });
    setShowImageModal(true);
  }, [hostProfileUrl]);

  return (
    <>
      <View style={{ height: headerHeight }} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCoverPress}
          disabled={!hostCoverUrl}
          containerStyle={{ pointerEvents: "none" }}
        >
          <Image
            source={
              hostCoverUrl
                ? { uri: baseURL + hostCoverUrl }
                : require("../../assets/images/onboarding/page1.png")
            }
            transition={100}
            style={{ height: coverHeight, ...style.coverImageContainer }}
          />
        </TouchableOpacity>

        <View style={style.mainContentContainer} pointerEvents="box-none">
          <TouchableOpacity
            onPress={onProfilePress}
            containerStyle={{ pointerEvents: "none" }}
          >
            <ProfileImage
              source={hostProfileUrl ? { uri: baseURL + hostProfileUrl } : null}
              size={160}
              fillColor="white"
              borderColor="white"
              borderWidth={5}
              containerStyle={style.profileImageContainer}
            />
          </TouchableOpacity>

          <View style={style.contentContainer} pointerEvents="none">
            <View style={style.nameContainer}>
              <Text style={style.hostName}>{hostName ?? "Loading..."}</Text>

              <StarRatingView
                starSize={25}
                rating={listingsAvgRating}
                containerStyle={style.ratingContainer}
              />

              {/*<Text style={style.userName}>*/}
              {/*  {"@" + (!userName ? "" : userName.replaceAll(" ", ""))}*/}
              {/*</Text>*/}
            </View>
            <View style={style.overviewContainer}>
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
        imageData={[modalImage]} // Wrap image in an array
        visible={showImageModal}
        onClose={() => setShowImageModal(false)}
        showIndex={false}
      />
    </>
  );
};

export default memo(HeaderProfileHost);
