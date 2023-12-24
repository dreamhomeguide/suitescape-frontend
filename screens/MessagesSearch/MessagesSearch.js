import React from "react";
import { View } from "react-native";

import FormInput from "../../components/FormInput/FormInput";
import style from "../Messages/MessagesStyle";
const MessagesSearch = () => {
  return (
    <View>
      <View style={style.searchContainer}>
        {/*<View style={{ flexDirection: "row", justifyContent: "space-between" }}>*/}
        {/*  <TextInput autoFocus style={style.searchText} />*/}
        {/*  <FontAwesome name="search" size={20} color="black" />*/}
        {/*</View>*/}
        <FormInput autoFocus placeholder="Search" />
      </View>
    </View>
  );
};

export default MessagesSearch;
