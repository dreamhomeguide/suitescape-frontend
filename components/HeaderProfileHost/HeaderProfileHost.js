import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

import style from "./HeaderProfileHostStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";
import Button from "../Button/Button";
import ProfileImage from "../ProfileImage/ProfileImage";

const MIN_HEIGHT = 700;

const HeaderProfileHost = ({
  hostName,
  userName,
  listingsCount,
  likesCount,
  reviewsCount,
}) => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const heightAdjustment = height > MIN_HEIGHT ? 45 : -10;
  const coverHeight = height / 4 - heightAdjustment;

  return (
    <View style={style.mainContainer} pointerEvents="box-none">
      <Image
        source={require("../../assets/images/onboarding/page1.png")}
        style={{ height: coverHeight, ...style.coverImageContainer }}
      />
      <View style={style.mainContentContainer} pointerEvents="box-none">
        <ProfileImage
          size={160}
          fillColor="white"
          borderColor="white"
          borderWidth={5}
          containerStyle={style.profileImageContainer}
        />
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
          <View style={style.actionButtonsContainer} pointerEvents="box-none">
            <Button
              onPress={() => navigation.navigate(Routes.CHAT)}
              containerStyle={style.buttonContainer}
            >
              Message
            </Button>
            <Button
              onPress={() => console.log("Host liked")}
              containerStyle={style.buttonContainer}
              outlined
            >
              Like
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderProfileHost;
