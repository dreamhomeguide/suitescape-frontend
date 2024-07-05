import { useScrollToTop } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ChatListStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import ChatListItem from "../../components/ChatListItem/ChatListItem";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar";
import FormInput from "../../components/FormInput/FormInput";
import { useSettings } from "../../contexts/SettingsContext";
import { Routes } from "../../navigation/Routes";
import { fetchAllChats } from "../../services/apiService";

const ChatList = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const flatListRef = useRef(null);

  useScrollToTop(flatListRef);

  const { settings } = useSettings();
  const insets = useSafeAreaInsets();

  const {
    data: chats,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
    enabled: !settings.guestModeEnabled,
  });

  const renderItem = useCallback(
    ({ item }) => <ChatListItem item={item} />,
    [],
  );

  const EmptyListComponent = useCallback(() => {
    return isFetching ? (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    ) : (
      <View style={globalStyles.flexCenter}>
        <Text style={globalStyles.emptyTextCenter}>No messages yet.</Text>
      </View>
    );
  }, [isFetching]);

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

  // if (settings.guestModeEnabled) {
  //   return (
  //     <View style={globalStyles.flexCenter}>
  //       <FocusAwareStatusBar style="dark" animated />
  //       <Text>Not logged in</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={globalStyles.flexFull}>
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
            <Pressable
              onPress={() => navigation.navigate(Routes.CHAT_SEARCH)}
              style={({ pressed }) => ({
                ...style.searchContainer,
                ...pressedOpacity(pressed, 0.4),
              })}
            >
              <FormInput
                type="search"
                placeholder="Search"
                containerStyle={{ pointerEvents: "none" }}
              />
            </Pressable>
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
