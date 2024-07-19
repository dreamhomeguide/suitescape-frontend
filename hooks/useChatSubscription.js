import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef } from "react";
import { Toast } from "react-native-toast-notifications";

import toastStyles from "../assets/styles/toastStyles";
import { Routes } from "../navigation/Routes";
import PusherEcho from "../services/PusherEcho";

const useChatSubscription = () => {
  const chatListener = useRef(null);
  const currentRoute = useNavigationState((state) => state.routes[state.index]);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const unsubscribeFromChats = useCallback(() => {
    chatListener.current?.stopListening(".message.sent");
    chatListener.current?.stopListening(".chat.read");
  }, []);

  const subscribeToChats = useCallback(
    (userId) => {
      const channelName = "private-chat." + userId;

      // Unsubscribe from previous chat updates first so that current route is updated
      if (chatListener.current) {
        unsubscribeFromChats();
      } else {
        chatListener.current = PusherEcho.private(channelName);
      }

      chatListener.current.listen(".message.sent", async (message) => {
        // const hostId = senderId === userData.id ? receiverId : senderId;
        const { id: senderId, fullname: senderName } = message.sender;

        // Vibrate when a new message is received
        await Haptics.impactAsync();

        // Show a notification only if the user is not talking currently to the sender
        if (
          currentRoute.name !== Routes.CHAT ||
          currentRoute.params?.id !== senderId
        ) {
          if (Device.isDevice) {
            // Present notification immediately after getting message
            await Notifications.scheduleNotificationAsync({
              content: {
                title: senderName,
                subtitle: message.content,
                data: {
                  senderId,
                },
              },
              trigger: null,
            });
          } else {
            // Show virtual notification
            Toast.show(`${senderName}: ${message.content}`, {
              type: "success",
              placement: "top",
              style: toastStyles.toastInsetTop,
              onPress: () => {
                navigation.navigate(Routes.CHAT, { id: senderId });
              },
            });
          }
        }

        // Invalidate the chat queries
        await queryClient.invalidateQueries({
          queryKey: ["chats", senderId],
        });
        await queryClient.invalidateQueries({
          queryKey: ["chats"],
          exact: true,
        });
      });

      chatListener.current.listen(".chat.read", async ({ user }) => {
        console.log("Read chat by", user.fullname);
        await queryClient.invalidateQueries({
          queryKey: ["chats"],
          exact: true,
        });
      });

      chatListener.current.subscribed(() => {
        console.log("Subscribed to chat updates", userId);
      });

      chatListener.current.error((error) => {
        console.log(error);
        // Alert.alert("Error", "Failed to subscribe to chat updates");
      });
    },
    [currentRoute],
  );

  useEffect(() => {
    return () => {
      const channelName = chatListener.current?.name;
      if (channelName) {
        PusherEcho.leave(channelName);
        console.log("Unsubscribed from chat updates");
      }
    };
  }, []);

  return { subscribeToChats, unsubscribeFromChats };
};

export default useChatSubscription;
