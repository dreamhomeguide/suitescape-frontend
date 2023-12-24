import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./SliderReviewItemStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import ProfileImage from "../ProfileImage/ProfileImage";
import StarRatingView from "../StarRatingView/StarRatingView";

const SliderReviewItem = ({ item, itemWidth, itemMargin }) => {
  const { user, rating, content } = item;

  return (
    <View style={style.mainContainer({ itemWidth, itemMargin })}>
      <Pressable
        onPress={() => console.log("User ID: ", user.id)}
        style={({ pressed }) => ({
          ...style.userContainer,
          ...pressedOpacity(pressed),
        })}
      >
        <ProfileImage size={45} />
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
