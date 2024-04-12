import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import style from "./ChatStyles";
import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import ButtonBack from "../../components/ButtonBack/ButtonBack";
import ChatItem from "../../components/ChatItem/ChatItem";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import StarRatingView from "../../components/StarRatingView/StarRatingView";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import useActiveStatusSubscription from "../../hooks/useActiveStatusSubscription";
import { Routes } from "../../navigation/Routes";
import { baseURL } from "../../services/SuitescapeAPI";
import {
  fetchAllMessages,
  fetchHost,
  sendMessage,
} from "../../services/apiService";
import { handleApiError, handleApiResponse } from "../../utils/apiHelpers";

const Chat = ({ route, navigation }) => {
  const [userMessage, setUserMessage] = useState("");

  const hostId = route.params.id;

  const flatListRef = useRef(null);

  const { subscribeToActiveStatus } = useActiveStatusSubscription();
  const { authState } = useAuth();
  const { settings } = useSettings();
  const queryClient = useQueryClient();

  const { data: host } = useQuery({
    queryKey: ["hosts", hostId],
    queryFn: () => fetchHost(hostId),
  });

  const { data: messages, isLoading } = useQuery({
    queryKey: ["chats", hostId],
    queryFn: () => fetchAllMessages(hostId),
    enabled: !settings.guestModeEnabled,
  });

  // Subscribe to active status when the user is authenticated
  useEffect(() => {
    if (authState.userToken) {
      subscribeToActiveStatus(hostId);
    }
  }, [authState.userToken]);

  useEffect(() => {
    if (messages) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });

      // Invalidate the chat list query to remove the unread message count
      (async () => {
        await queryClient.invalidateQueries({
          queryKey: ["chats"],
          exact: true,
        });
      })();
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          console.log(res);

          await queryClient.invalidateQueries({
            queryKey: ["chats"],
            exact: true,
          });
          await queryClient.invalidateQueries({ queryKey: ["chats", hostId] });
        },
      }),
    onError: (err) => {
      handleApiError({
        error: err,
        defaultAlert: true,
      });
    },
  });

  const handleSendMessage = useCallback(() => {
    setUserMessage("");

    if (!userMessage.trim()) {
      console.log("No message to send");
      return;
    }

    if (!sendMessageMutation.isPending) {
      queryClient.setQueryData(
        ["chats", hostId],
        [
          {
            id: messages.length + 1,
            content: userMessage,
            is_current_user_sender: true,
            is_pending: true,
          },
          ...messages,
        ],
      );

      sendMessageMutation.mutate({
        hostId,
        content: userMessage,
      });
    }
  }, [hostId, userMessage, sendMessageMutation.isPending, queryClient]);

  const onLayout = useCallback(() => {
    if (Platform.OS === "ios") {
      if (!Keyboard.isVisible()) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    } else {
      if (Keyboard.isVisible()) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ChatItem
        message={item.content}
        isSender={item.is_current_user_sender}
        isPending={item.is_pending}
      />
    ),
    [],
  );

  const onHostPress = useCallback(() => {
    if (hostId) {
      navigation.navigate(Routes.PROFILE_HOST, { hostId });
    }
  }, [navigation]);

  const HostDetailsView = (
    <View style={style.messageHeader}>
      <Pressable
        onPress={onHostPress}
        style={({ pressed }) => pressedOpacity(pressed)}
      >
        <ProfileImage
          source={
            host?.picture_url ? { uri: baseURL + host?.picture_url } : null
          }
          size={100}
        />
      </Pressable>
      <Text style={style.messageHostName}>{host?.fullname}</Text>
      <StarRatingView
        starSize={15}
        rating={4.7}
        textStyle={{ color: "black" }}
        containerStyle={{ paddingVertical: 5 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.flexFull}>
      <StatusBar style="dark" />

      <View style={style.headerContainer}>
        <View style={style.headerTitleContainer}>
          <ButtonBack />
          <View style={style.headerNameAndActiveStatus}>
            <Pressable
              onPress={onHostPress}
              style={({ pressed }) => pressedOpacity(pressed)}
            >
              <Text style={style.recipientName}>{host?.fullname}</Text>
            </Pressable>
            <View style={style.activeStatusContainer}>
              <Text>{host?.active ? "Active Now" : "Offline"}</Text>
              <View style={style.activeStatusIndicator(host?.active)} />
            </View>
          </View>
        </View>
        <MaterialIcons style={style.materialIconError} name="error" size={25} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={globalStyles.flexFull}
      >
        <FlatList
          ref={flatListRef}
          onLayout={onLayout}
          keyExtractor={(item) => item.id.toString()}
          data={messages}
          renderItem={renderItem}
          windowSize={3} // Prevents stuttering when scrolling to the bottom on first launch
          style={style.messageList}
          contentContainerStyle={style.messageListContent}
          ListHeaderComponent={isLoading ? <ActivityIndicator /> : null}
          ListFooterComponent={HostDetailsView}
          inverted={messages?.length > 0}
        />

        <View style={style.sendMessageContainer}>
          <View style={style.messageEditorContainer}>
            <TextInput
              value={userMessage}
              onChangeText={setUserMessage}
              style={style.textInput}
              // autoFocus
              multiline
              placeholder="Type a message..."
            />
            <View style={style.emojiKeyboardContainer}>
              <Entypo name="emoji-happy" size={24} color="black" />
            </View>
          </View>

          <Pressable
            onPress={handleSendMessage}
            disabled={sendMessageMutation.isPending}
            style={({ pressed }) => ({
              ...style.sendMessageButtonContainer,
              ...pressedOpacity(pressed),
            })}
          >
            {/*{sendMessageMutation.isPending ? (*/}
            {/*  <ActivityIndicator />*/}
            {/*) : (*/}
            {/*  <Ionicons name="send" size={24} color="black" />*/}
            {/*)}*/}
            <Ionicons
              name="send"
              size={24}
              color={sendMessageMutation.isPending ? "gray" : Colors.blue}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
