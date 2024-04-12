import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import style from "../../assets/styles/searchStyles";

const SearchRecentItem = ({ item, onPress, onClose }) => {
  return (
    <View style={style.searchItemContainer}>
      <Pressable
        style={({ pressed }) => ({
          ...style.searchItemContentContainer,
          ...pressedOpacity(pressed),
        })}
        onPress={onPress}
      >
        <View style={style.recentItemContainer}>
          <View style={style.iconContainer}>
            <Ionicons name="time" size={20} color={Colors.blue} />
          </View>
          <View style={style.recentItemContentContainer}>
            <Text numberOfLines={1}>{item.location}</Text>
            <Text style={{ color: Colors.gray }}>{item.details}</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => ({
          ...style.deleteButton,
          ...pressedOpacity(pressed),
        })}
        onPress={onClose}
      >
        <Ionicons name="close" size={20} color={Colors.blue} />
      </Pressable>
    </View>
  );
};

export default SearchRecentItem;
