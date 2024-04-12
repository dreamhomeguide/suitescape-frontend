import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import PusherEcho from "../services/PusherEcho";

const useActiveStatusSubscription = () => {
  const activeStatusListener = useRef(null);
  const queryClient = useQueryClient();

  const unsubscribeFromActiveStatus = useCallback(() => {
    activeStatusListener.current?.stopListening(".active-status.updated");
  }, []);

  const subscribeToActiveStatus = useCallback((userId) => {
    const channelName = "private-active-status." + userId;

    // Unsubscribe from previous active status updates first
    if (activeStatusListener.current) {
      unsubscribeFromActiveStatus();
    } else {
      activeStatusListener.current = PusherEcho.private(channelName);
    }

    activeStatusListener.current
      .listen(".active-status.updated", async ({ user }) => {
        // await queryClient.setQueryData(["hosts", userId], user);

        await queryClient.invalidateQueries({
          queryKey: ["hosts", userId],
        });
        console.log("Active status updated for", user.fullname);
      })
      .subscribed(() => {
        console.log("Subscribed to active status updates");
      })
      .error((error) => {
        console.log("Error", error);
        // Alert.alert(
        //   "Error subscribing to active status updates",
        //   error.message,
        // );
      });
  }, []);

  useEffect(() => {
    return () => {
      const channelName = activeStatusListener.current?.name;
      if (channelName) {
        PusherEcho.leave(channelName);
        console.log("Unsubscribed from active status updates");
      }
    };
  }, []);

  return { subscribeToActiveStatus, unsubscribeFromActiveStatus };
};

export default useActiveStatusSubscription;
