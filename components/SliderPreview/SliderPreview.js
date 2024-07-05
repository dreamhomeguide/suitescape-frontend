import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import style from "./SliderPreviewStyles";
import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { baseURL } from "../../services/SuitescapeAPI";

const SliderPreview = ({ type, data, onItemPress, onAddItem }) => {
  const renderImageItem = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => ({
          ...style.mediaContainer,
          ...pressedOpacity(pressed),
        })}
        onPress={() => onItemPress && onItemPress(item)}
      >
        <Image
          source={item.isLocal ? item.uri : baseURL + item.url}
          contentFit="cover"
          style={style.media}
        />
      </Pressable>
    ),
    [onItemPress],
  );

  const renderVideoItem = useCallback(
    ({ item }) => (
      <Pressable
        style={({ pressed }) => ({
          ...style.mediaContainer,
          ...pressedOpacity(pressed),
        })}
        onPress={() => onItemPress && onItemPress(item)}
      >
        {item.is_transcoded ? null : (
          <View style={style.placeholderContainer}>
            {item.transcodeProgress ? (
              <Text style={style.placeholderText}>
                {item.transcodeProgress.percentage}%
              </Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        )}

        <Video
          source={{
            uri: item.isLocal ? item.uri : baseURL + item.url,
          }}
          resizeMode="cover"
          style={style.media}
        />
      </Pressable>
    ),
    [onItemPress],
  );

  return (
    <FlatList
      data={data}
      renderItem={type === "image" ? renderImageItem : renderVideoItem}
      ListFooterComponent={
        <Pressable style={style.mediaContainer} onPress={onAddItem}>
          <MaterialCommunityIcons name="plus" size={50} color={Colors.blue} />
        </Pressable>
      }
      contentContainerStyle={style.contentContainer}
      showsHorizontalScrollIndicator={false}
      horizontal
    />
  );
};

export default memo(SliderPreview);
