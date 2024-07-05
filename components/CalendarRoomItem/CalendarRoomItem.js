import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import { pressedBgColor } from "../../assets/styles/globalStyles";
import { Routes } from "../../navigation/Routes";

const CalendarRoomItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(Routes.CALENDAR, {
          id: item.id,
          type: "room",
        })
      }
      style={({ pressed }) => ({
        ...style.listItemContainer,
        ...pressedBgColor(pressed),
      })}
    >
      <View style={style.listItemContentContainer}>
        <Text style={style.listItemTitle}>{item.category.name}</Text>
        {item.category.description && (
          <Text numberOfLines={4}>
            <Text style={style.listItemLabel}>Description: </Text>
            {item.category.description}
          </Text>
        )}
        <Text>
          <Text style={style.listItemLabel}>Floor Area: </Text>
          {item.category.floor_area} sqm
        </Text>
        <Text>
          <Text style={style.listItemLabel}>Price: </Text>₱{item.category.price}
        </Text>
        <Text>
          <Text style={style.listItemLabel}>Quantity: </Text>
          {item.category.quantity}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color={Colors.blue} />
    </Pressable>
  );
};

export default memo(CalendarRoomItem);
