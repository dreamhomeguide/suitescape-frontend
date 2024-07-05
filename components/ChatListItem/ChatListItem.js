import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import React, { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { Routes } from "../../navigation/Routes";
import style from "../../screens/ChatList/ChatListStyles";
import { baseURL } from "../../services/SuitescapeAPI";
import ProfileImage from "../ProfileImage/ProfileImage";

const ChatListItem = ({ item }) => {
  const {
    user,
    latest_message,
    unread_messages_count: unreadMessagesCount,
  } = item || {};

  const {
    content,
    sender_id: senderId,
    created_at: createdAt,
  } = latest_message || {};

  const { authState } = useAuth();
  const navigation = useNavigation();

  const onChatPress = useCallback(() => {
    navigation.navigate(Routes.CHAT, { id: user.id });
  }, [navigation, user.id]);

  return (
    <Pressable
      style={({ pressed }) => style.singleChatContainer(pressed)}
      onPress={onChatPress}
    >
      <ProfileImage
        source={
          user.profile_image_url
            ? { uri: baseURL + user.profile_image_url }
            : null
        }
      />
      <View style={style.singleChatDetails}>
        <Text style={style.hostName} numberOfLines={1}>
          {user.fullname}
        </Text>
        <Text numberOfLines={1} style={style.unreadMessage}>
          {senderId === authState.userId && "You: "}
          {content}
        </Text>
      </View>
      <View style={style.messageStatusContainer}>
        <Text style={style.timeFrame}>
          {createdAt && format(createdAt, "h:mm aa")}
        </Text>
        {unreadMessagesCount > 0 && (
          <View style={style.unreadMessagesCount}>
            <Text style={style.newMessageCountText}>{unreadMessagesCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default memo(ChatListItem);
