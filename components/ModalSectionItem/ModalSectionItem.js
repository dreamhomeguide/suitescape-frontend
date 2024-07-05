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
  imageWidth,
  detailsWidth,
}) => {
  return (
    <RectButton
      style={style.mainContainer({ isActive, width })}
      onPress={onPress}
    >
      <View style={style.contentContainer(detailsWidth)}>
        <Text style={style.text} numberOfLines={3}>{`${index}. ${label}`}</Text>
        <Text>{format(time, "mm:ss")}</Text>
      </View>
      <Image source={{ uri: thumbnailUri }} style={style.image(imageWidth)} />
    </RectButton>
  );
};

export default memo(ModalSectionItem);
