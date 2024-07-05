import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Video } from "expo-av";
import React, { memo, useState } from "react";
import { View } from "react-native";

import style from "./AddVideoItemStyles";
import { Colors } from "../../assets/Colors";
import createListingStyles from "../../assets/styles/createListingStyles";
import { baseURL } from "../../services/SuitescapeAPI";
import ButtonIcon from "../ButtonIcon/ButtonIcon";

const AddVideoItem = ({ item, shouldPlay, onEditVideo, onDeleteVideo }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={createListingStyles.mediaContainer}>
      <Video
        source={{ uri: item.isLocal ? item.uri : baseURL + item.url }}
        style={createListingStyles.video}
        useNativeControls
        isLooping
        onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
        shouldPlay={isPlaying && shouldPlay}
        resizeMode="contain"
      />

      <View style={style.buttonsContainer}>
        <ButtonIcon
          renderIcon={() => (
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color={Colors.blue}
            />
          )}
          onPress={onEditVideo}
          color={Colors.lightgray}
          pressedColor={Colors.gray}
          containerStyle={style.button}
        />

        <ButtonIcon
          renderIcon={() => (
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color={Colors.red}
            />
          )}
          onPress={onDeleteVideo}
          color={Colors.lightgray}
          pressedColor={Colors.gray}
          containerStyle={style.button}
        />
      </View>
    </View>
  );
};

export default memo(AddVideoItem);
