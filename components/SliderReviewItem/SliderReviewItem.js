import React, { memo } from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import style from "./SliderReviewItemStyles";
import ProfileImage from "../ProfileImage/ProfileImage";
import StarRatingView from "../StarRatingView/StarRatingView";

const SliderReviewItem = ({ item, onPress, itemWidth, itemMargin }) => {
  return (
    <RectButton
      onPress={onPress}
      style={style.mainContainer({ itemWidth, itemMargin })}
    >
      <View style={style.userContainer}>
        {/*<Avatar.Image source={item.img} size={50} style={style.avatar} />*/}

        <ProfileImage size={45} />
        <View style={style.userNameContainer}>
          <Text style={{ ...style.userName, ...style.text }} numberOfLines={1}>
            {item.user.fullname}
          </Text>
          <StarRatingView starSize={15} rating={item.rating} />
        </View>
      </View>
      <View style={style.reviewContainer}>
        <Text style={style.text}>{item.content}</Text>
      </View>
    </RectButton>
  );
};

export default memo(SliderReviewItem);
