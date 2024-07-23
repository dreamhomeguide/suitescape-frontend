import { useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { useSettings } from "../contexts/SettingsContext";
import { fetchAllChats } from "../services/apiService";

const useUnreadCount = () => {
  const { settings } = useSettings();

  const { data: unreadCount } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
    enabled: !settings.guestModeEnabled,
    placeholderData: [],
    select: (data) => {
      return data?.filter((chat) => chat.unread_messages_count > 0).length;
    },
  });

  useEffect(() => {
    (async () => {
      await Notifications.setBadgeCountAsync(unreadCount);
      console.log("Updated badge count:", unreadCount);
    })();
  }, [unreadCount]);

  // Clear badge count when app is in foreground
  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     "change",
  //     async (nextAppState) => {
  //       if (nextAppState === "active") {
  //         await Notifications.setBadgeCountAsync(0);
  //         console.log("Cleared badge count!");
  //       }
  //     },
  //   );
  //
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  return unreadCount;
};

export default useUnreadCount;
