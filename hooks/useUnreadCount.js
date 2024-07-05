import { useQuery } from "@tanstack/react-query";

import { useSettings } from "../contexts/SettingsContext";
import { fetchAllChats } from "../services/apiService";

const useUnreadCount = () => {
  const { settings } = useSettings();

  const { data: unreadCount } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
    enabled: !settings.guestModeEnabled,
    select: (data) => {
      return data?.filter((chat) => chat.unread_messages_count > 0).length;
    },
  });

  return unreadCount;
};

export default useUnreadCount;
