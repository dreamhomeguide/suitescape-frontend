import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

import style from "./ButtonSocialLoginStyles";
import Facebook from "../../assets/images/svgs/icons8-facebook.svg";
import Google from "../../assets/images/svgs/icons8-google.svg";
import {
  pressedBorderColor,
  pressedColor,
} from "../../assets/styles/globalStyles";

const ButtonSocialLogin = ({ type }) => {
  const SocialTypes = {
    phone: {
      label: "Continue with Phone",
      iconComponent: <FontAwesome name="mobile-phone" size={40} color="gray" />,
      onPress: () => console.log("Phone"),
    },
    facebook: {
      label: "Continue with Facebook",
      iconComponent: <Facebook width={35} height={35} />,
      onPress: () => console.log("Facebook"),
    },
    google: {
      label: "Continue with Google",
      iconComponent: <Google width={32} height={32} />,
      onPress: () => console.log("Google"),
    },
  };

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") {
          Haptics.selectionAsync();
        }
        SocialTypes[type]?.onPress && SocialTypes[type]?.onPress();
      }}
      style={({ pressed }) => ({
        ...style.mainContainer,
        ...pressedBorderColor(pressed, "black"),
      })}
    >
      {({ pressed }) => (
        <View style={style.contentContainer}>
          <View style={style.iconContainer}>
            {SocialTypes[type]?.iconComponent}
          </View>
          <Text
            style={{
              ...style.text,
              ...pressedColor(pressed, "rgba(0,0,0,0.6)"),
            }}
          >
            {SocialTypes[type]?.label}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default ButtonSocialLogin;
