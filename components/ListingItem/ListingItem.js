import { ImageBackground } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

import style from "./ListingItemStyles";
import globalStyles, { pressedBgColor } from "../../assets/styles/globalStyles";
import StarRatingView from "../StarRatingView/StarRatingView";

const ListingItem = ({ item }) => {
  return (
    <Pressable style={globalStyles.flexFull}>
      {({ pressed }) => (
        <View style={style.mainContainer}>
          <ImageBackground
            source={require("../../assets/images/onboarding/page1.png")}
            style={globalStyles.coverImage}
            imageStyle={style.imageBorderRadius}
          >
            <View
              style={{
                ...globalStyles.flexFull,
                ...style.imageBorderRadius,
                ...pressedBgColor(pressed, "rgba(0,0,0,0.3)"),
              }}
            />
          </ImageBackground>
          <View style={style.detailsContainer}>
            <Text style={style.detailsName}>{item.name}</Text>
            <StarRatingView
              rating={item.average_rating}
              textStyle={style.detailsRatingText}
              starSize={25}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default ListingItem;
