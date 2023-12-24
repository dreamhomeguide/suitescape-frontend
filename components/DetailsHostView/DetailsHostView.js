import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, Share, Text, View } from "react-native";

import style from "./DetailsHostViewStyles";
import { Colors } from "../../assets/Colors";
import detailsStyles from "../../assets/styles/detailsStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { useListingContext } from "../../contexts/ListingContext";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import ButtonLink from "../ButtonLink/ButtonLink";
import ButtonSocialActionsView from "../ButtonSocialActionsView/ButtonSocialActionsView";
import ProfileImage from "../ProfileImage/ProfileImage";

const DetailsHostView = ({ hostName }) => {
  const navigation = useNavigation();
  const { listing } = useListingContext();

  const handleHostPress = () => {
    navigation.navigate(Routes.PROFILE_HOST, {
      hostId: listing.host.id,
    });
  };

  return (
    <View style={detailsStyles.plainContainer}>
      <View style={style.hostContentContainer}>
        <Pressable
          onPress={handleHostPress}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <ProfileImage size={60} borderWidth={1} borderColor={Colors.blue} />
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
        onChatNow={() => navigation.navigate(Routes.CHAT)}
        onShare={async () =>
          await Share.share({
            message:
              "Check out this listing: " + baseURL + "/listings/" + listing.id,
          })
        }
      />
    </View>
  );
};

export default DetailsHostView;
