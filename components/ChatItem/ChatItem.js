import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./ChatItemStyles";

const ChatItem = ({ message, isSender, isPending }) => {
  return (
    <View style={style.mainContainer(isSender)}>
      <View style={style.chatContainer(isSender)}>
        <Text selectable style={style.message(isSender)}>
          {message}
        </Text>
      </View>
      {isPending && <Text style={{ color: "gray" }}>Sending...</Text>}
    </View>
  );
};

export default memo(ChatItem);
