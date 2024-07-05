import React from "react";
import { View } from "react-native";

import FormInput from "../../components/FormInput/FormInput";
import style from "../ChatList/ChatListStyles";

const ChatSearch = () => {
  return (
    <View style={style.searchContainer}>
      <FormInput type="search" placeholder="Search" autoFocus />
    </View>
  );
};

export default ChatSearch;
