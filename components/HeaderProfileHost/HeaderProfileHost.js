import { Image } from "expo-image";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

import style from "./HeaderProfileHostStyles";
import globalStyles from "../../assets/styles/globalStyles";
import Button from "../Button/Button";
import ProfileImage from "../ProfileImage/ProfileImage";

const HeaderProfileHost = () => {
  const { height } = useWindowDimensions();

  const coverHeight = height / 4 - 50;

  return (
    <View style={style.mainContainer} pointerEvents="box-none">
      <Image
        source={require("../../assets/images/onboarding/page1.png")}
        style={{ height: coverHeight, ...style.coverImageContainer }}
        pointerEvents="none"
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
            <Text style={style.hostName}>Anne Hathaway</Text>
            <Text style={style.userName}>@AnneHath</Text>
          </View>
          <View style={style.overviewContainer} pointerEvents="box-none">
            <View style={style.overviewItemContainer}>
              <Text style={style.overviewItemCount}>5</Text>
              <Text style={style.overviewItemLabel}>Listings</Text>
            </View>
            <View style={globalStyles.verticalDivider} />
            <View style={style.overviewItemContainer}>
              <Text style={style.overviewItemCount}>1.9k</Text>
              <Text style={style.overviewItemLabel}>Likes</Text>
            </View>
            <View style={globalStyles.verticalDivider} />
            <View style={style.overviewItemContainer}>
              <Text style={style.overviewItemCount}>1.5k</Text>
              <Text style={style.overviewItemLabel}>Reviews</Text>
            </View>
          </View>
          <View style={style.actionButtonsContainer} pointerEvents="box-none">
            <Button containerStyle={style.buttonContainer}>Message</Button>
            <Button containerStyle={style.buttonContainer} outlined>
              Like
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderProfileHost;
