import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import React, { memo, useCallback } from "react";
import { Pressable, Share, Text, View } from "react-native";

import style from "./DetailsHostViewStyles";
import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { useListingContext } from "../../contexts/ListingContext";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import ButtonLink from "../ButtonLink/ButtonLink";
import ButtonSocialActionsView from "../ButtonSocialActionsView/ButtonSocialActionsView";
import ProfileImage from "../ProfileImage/ProfileImage";

const DetailsHostView = ({ hostId, hostName, hostPictureUrl }) => {
  const navigation = useNavigation();
  const { listing } = useListingContext();

  const handleHostPress = useCallback(() => {
    if (hostId) {
      navigation.navigate(Routes.PROFILE_HOST, { hostId });
    }
  }, [hostId]);

  const onChatNow = useCallback(() => {
    if (hostId) {
      navigation.navigate(Routes.CHAT, { id: hostId });
    }
  }, [hostId]);

  const onShare = useCallback(async () => {
    if (listing?.id) {
      const url = Linking.createURL("/listings/" + listing.id);
      await Share.share({
        title: `Check out this listing on Suitescape: (${listing?.name}`,
        message: url,
      });
    }
  }, [listing?.id]);

  return (
    <View style={style.container}>
      <View style={style.hostContentContainer}>
        <Pressable
          onPress={hostId && handleHostPress}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <ProfileImage
            source={hostPictureUrl ? { uri: baseURL + hostPictureUrl } : null}
            size={60}
            borderWidth={1.5}
            borderColor={Colors.blue}
          />
        </Pressable>

        <View style={style.hostDetailsContainer}>
          {/* Host Name */}
          <ButtonLink onPress={handleHostPress} textStyle={style.hostNameText}>
            {hostName ?? "Loading..."}
          </ButtonLink>

          {/* Response Rate */}
          <View style={style.responseContainer}>
            <Text style={style.responseText}>Response Rate: 95%</Text>
            <Text style={style.responseText}>
              Response Time: within an hour
            </Text>
          </View>
        </View>
      </View>

      {/* Listing Actions */}
      <ButtonSocialActionsView
        onChatNow={hostId && onChatNow}
        onShare={listing?.id && onShare}
      />
    </View>
  );
};

export default memo(DetailsHostView);
