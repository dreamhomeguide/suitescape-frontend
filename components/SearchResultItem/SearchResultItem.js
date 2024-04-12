import React from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import searchStyles from "../../assets/styles/searchStyles";

const SearchResultItem = ({ item, onPress }) => {
  return (
    <View style={searchStyles.searchItemContainer}>
      <Pressable
        style={({ pressed }) => ({
          ...searchStyles.searchItemContentContainer,
          ...pressedOpacity(pressed),
        })}
        onPress={onPress}
      >
        <View style={{ flex: 1, rowGap: 3 }}>
          <Text>{item.location}</Text>
          <Text style={{ color: Colors.gray }}>{item.details}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SearchResultItem;
