import { format } from "date-fns";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import style from "./ModalSectionItemStyles";

const ModalSectionItem = ({
  index,
  label,
  time,
  thumbnailUri,
  onPress,
  isActive,
  width,
  imageSize,
}) => {
  return (
    <RectButton
      style={style.mainContainer({ isActive, width })}
      onPress={() => onPress && onPress(time)}
    >
      <View style={style.contentContainer}>
        <Text style={style.text}>{`${index}. ${label}`}</Text>
        <Text>{format(time, "mm:ss")}</Text>
      </View>
      <Image source={{ uri: thumbnailUri }} style={style.image(imageSize)} />
    </RectButton>
  );
};

export default memo(ModalSectionItem);
