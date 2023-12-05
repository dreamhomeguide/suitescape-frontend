import React from "react";
import { Text, View } from "react-native";

import style from "./ChatClientStyle";

const ChatClient = ({ type, message }) => {
  return (
    <View style={style.mainContainer(type)}>
      <View style={style.chatContainer(type)}>
        <Text selectable style={style.message(type)}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default ChatClient;
