import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ChatListStyles";
import globalStyles from "../../assets/styles/globalStyles";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar";
import FormInput from "../../components/FormInput/FormInput";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import { fetchAllChats } from "../../services/apiService";

const ChatList = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();

  const flatListRef = useRef(null);

  useScrollToTop(flatListRef);

  const { authState } = useAuth();
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();

  const {
    data: chats,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
    enabled: !settings.guestModeEnabled,
  });

  const renderItem = useCallback(({ item }) => {
    const {
      latest_message: { content, sender_id: senderId, created_at: createdAt },
      user,
      unread_messages_count: unreadMessagesCount,
    } = item;

    return (
      <Pressable
        style={({ pressed }) => style.singleChatContainer(pressed)}
        onPress={() => {
          navigation.navigate(Routes.CHAT, { id: user.id });
        }}
      >
        <ProfileImage
          source={user.picture_url ? { uri: baseURL + user.picture_url } : null}
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
          <Text style={style.timeFrame}>{format(createdAt, "h:mm aa")}</Text>
          {unreadMessagesCount > 0 && (
            <View style={style.unreadMessagesCount}>
              <Text style={style.newMessageCountText}>
                {unreadMessagesCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }, []);

  const EmptyListComponent = useCallback(() => {
    return isFetched ? (
      <View style={globalStyles.flexCenter}>
        <Text style={globalStyles.emptyTextCenter}>No messages.</Text>
      </View>
    ) : (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    );
  }, [isFetched]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log("Chats refetched");
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  if (settings.guestModeEnabled) {
    return (
      <View style={globalStyles.flexCenter}>
        <FocusAwareStatusBar style="dark" animated />
        <Text>Not logged in</Text>
      </View>
    );
  }

  return (
    <View style={style.messagesContainer}>
      <FocusAwareStatusBar style="dark" animated />
      <FlatList
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        data={chats}
        renderItem={renderItem}
        contentInset={{ bottom: insets.bottom }}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={style.headerContainer}>
            <RectButton
              onPress={() => navigation.navigate(Routes.CHAT_SEARCH)}
              style={style.searchContainer}
            >
              <View pointerEvents="none">
                <FormInput placeholder="Search" />
              </View>
            </RectButton>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={EmptyListComponent}
      />
    </View>
  );
};

export default ChatList;
