import { useEffect } from "react";

import useChatSubscription from "./useChatSubscription";
import useProfileUpdates from "./useProfileUpdates";
import { useAuth } from "../contexts/AuthContext";

const useUpdates = () => {
  const { authState } = useAuth();
  const { subscribeToChats } = useChatSubscription();
  const { subscribeToProfileUpdates } = useProfileUpdates();

  // Subscribe to chat updates when the user is authenticated
  useEffect(() => {
    if (authState.userId) {
      subscribeToChats(authState.userId);
    }
  }, [authState.userId, subscribeToChats]);

  useEffect(() => {
    // Subscribe to profile updates
    subscribeToProfileUpdates();
  }, []);
};

export default useUpdates;
