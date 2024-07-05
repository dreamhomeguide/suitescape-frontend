import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { Switch } from "react-native-ui-lib";

import style from "./AddImageItemStyles";
import { Colors } from "../../assets/Colors";
import createListingStyles from "../../assets/styles/createListingStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { useModalGallery } from "../../contexts/ModalGalleryContext";
import { baseURL } from "../../services/SuitescapeAPI";
import capitalizedText from "../../utils/textCapitalizer";
import ButtonIcon from "../ButtonIcon/ButtonIcon";

const AddImageItem = ({ item, index, onSwitch, onDelete }) => {
  const { setIndex, showPhotoGallery } = useModalGallery();

  const onImagePress = useCallback(() => {
    setIndex(index);
    showPhotoGallery();
  }, [index]);

  return (
    <Pressable
      style={({ pressed }) => ({
        ...createListingStyles.mediaContainer,
        ...pressedOpacity(pressed),
      })}
      onPress={onImagePress}
    >
      <Image
        transition={100}
        source={{ uri: item.isLocal ? item.uri : baseURL + item.url }}
        style={createListingStyles.media}
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)"]}
        locations={[0, 0.6]}
        pointerEvents="none"
        style={style.gradient}
      />

      <ButtonIcon
        renderIcon={(pressed) => (
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={pressed ? "white" : Colors.red}
          />
        )}
        onPress={onDelete}
        color={Colors.lightgray}
        pressedColor={Colors.gray}
        containerStyle={style.buttonContainer}
      />

      <View style={style.switchContainer}>
        <Text style={style.switchLabel}>{capitalizedText(item.privacy)}</Text>
        <Switch
          value={item.privacy === "private"}
          onValueChange={onSwitch}
          onColor={Colors.blue}
        />
      </View>
    </Pressable>
  );
};

export default memo(AddImageItem);
