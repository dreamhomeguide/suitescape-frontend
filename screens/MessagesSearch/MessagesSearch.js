import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { TextInput, View } from "react-native";

import style from "../Messages/MessagesStyle";
const MessagesSearch = () => {
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <View style={style.searchContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TextInput autoFocus style={style.searchText} />
          <FontAwesome name="search" size={20} color="black" />
        </View>
      </View>
    </View>
  );
};

export default MessagesSearch;
