import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View } from "react-native";

import style from "./ButtonSocialActionsViewStyles";
import { Colors } from "../../assets/Colors";
import ButtonSocialAction from "../ButtonSocialAction/ButtonSocialAction";

const ButtonSocialActionsView = ({ onChatNow, onShare }) => {
  const socialButtons = [
    {
      name: "comment-o",
      label: "Chat Now",
      color: "orange",
      IconComponent: FontAwesome,
      onPress: onChatNow,
    },
    {
      name: "share-outline",
      label: "Share",
      color: Colors.blue,
      IconComponent: MaterialCommunityIcons,
      onPress: onShare,
    },
  ];

  return (
    <View style={style.socialButtonContainer}>
      <>
        {socialButtons.map((button, index) => (
          <ButtonSocialAction key={index} {...button} />
        ))}
      </>
    </View>
  );
};

export default ButtonSocialActionsView;
