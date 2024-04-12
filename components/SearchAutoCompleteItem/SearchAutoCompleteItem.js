import React from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import searchStyles from "../../assets/styles/searchStyles";

const SearchAutoCompleteItem = ({ item, onPress }) => {
  return (
    <View style={searchStyles.searchItemContainer}>
      <Pressable
        style={({ pressed }) => ({
          ...searchStyles.searchItemContentContainer,
          ...pressedOpacity(pressed),
        })}
        onPress={onPress}
      >
        <Text style={{ color: Colors.gray }}>{item}</Text>
      </Pressable>
    </View>
  );
};

export default SearchAutoCompleteItem;
