import { useNavigation } from "@react-navigation/native";
import React, { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./SliderReviewItemStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import ProfileImage from "../ProfileImage/ProfileImage";
import StarRatingView from "../StarRatingView/StarRatingView";

const SliderReviewItem = ({ item, itemWidth, itemMargin }) => {
  const navigation = useNavigation();

  const { user, rating, content } = item;

  const handleUserPress = useCallback(
    () => navigation.navigate(Routes.PROFILE_HOST, { hostId: user.id }),
    [navigation],
  );

  return (
    <View style={style.mainContainer({ itemWidth, itemMargin })}>
      <Pressable
        onPress={handleUserPress}
        style={({ pressed }) => ({
          ...style.userContainer,
          ...pressedOpacity(pressed),
        })}
      >
        <ProfileImage
          source={
            user.profile_image_url
              ? { uri: baseURL + user.profile_image_url }
              : null
          }
          size={45}
        />
        <View style={style.userNameContainer}>
          <Text style={{ ...style.userName, ...style.text }} numberOfLines={1}>
            {user.fullname}
          </Text>
          <StarRatingView starSize={15} rating={rating} />
        </View>
      </Pressable>

      <View style={style.reviewContainer}>
        <Text style={style.text}>{content}</Text>
      </View>
    </View>
  );
};

export default memo(SliderReviewItem);
