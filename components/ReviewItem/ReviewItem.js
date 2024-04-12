import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import style from "./ReviewItemStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import ProfileImage from "../ProfileImage/ProfileImage";
import ReadMore from "../ReadMore/ReadMore";
import StarRatingView from "../StarRatingView/StarRatingView";

const ReviewItem = ({ item }) => {
  const {
    user,
    rating,
    content,
    created_at,
    listing: {
      images: [coverImage],
      ...listing
    },
    room,
  } = item;

  const navigation = useNavigation();

  const onViewListing = useCallback(() => {
    navigation.push(Routes.LISTING_DETAILS, { listingId: listing.id });
  }, [navigation, listing.id]);

  return (
    <View style={style.mainContainer}>
      <View style={style.userContainer}>
        <ProfileImage
          source={user.picture_url ? { uri: baseURL + user.picture_url } : null}
          size={40}
          borderWidth={0}
        />
        <View style={style.userNameContainer}>
          <Text style={style.userName}>{user.fullname}</Text>
          <StarRatingView rating={rating} starSize={20} />
        </View>
      </View>
      <RectButton style={style.listingButtonContainer} onPress={onViewListing}>
        <Image
          source={{ uri: baseURL + coverImage.url }}
          style={style.listingImage}
          contentFit="cover"
        />
        <View style={style.listingDetailsContainer}>
          <Text style={style.listingCategory}>{room.category.name}</Text>
          <Text style={style.listingName}>{listing.name}</Text>
        </View>
      </RectButton>
      <View style={style.contentContainer}>
        <ReadMore numberOfLines={4}>{content}</ReadMore>
        <Text style={style.timestamp}>
          {format(new Date(created_at), "MM-dd-yyyy")}
        </Text>
      </View>
    </View>
  );
};

export default memo(ReviewItem);
