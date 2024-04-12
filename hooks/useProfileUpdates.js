import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import PusherEcho from "../services/PusherEcho";

const useProfileUpdates = () => {
  const profileUpdateListener = useRef(null);
  const queryClient = useQueryClient();

  const unsubscribeFromProfileUpdates = useCallback(() => {
    profileUpdateListener.current?.stopListening(".profile.updated");
  }, []);

  const subscribeToProfileUpdates = useCallback(() => {
    // Unsubscribe from previous profile updates first
    if (profileUpdateListener.current) {
      unsubscribeFromProfileUpdates();
    } else {
      profileUpdateListener.current = PusherEcho.channel(
        "public-profile-updates",
      );
    }

    profileUpdateListener.current
      .listen(".profile.updated", async (profile) => {
        // Update the profile in the cache if it's the same as the current user's profile
        if (profile.id === queryClient.getQueryData(["profile"])?.id) {
          await queryClient.setQueryData(["profile"], profile);
          console.log("Profile updated for", profile.fullname);
        }

        // Update the host profile in the cache
        if (
          profile.id === queryClient.getQueryData(["hosts", profile.id])?.id
        ) {
          // await queryClient.setQueryData(["hosts", profile.id], profile);

          await queryClient.invalidateQueries({
            queryKey: ["hosts", profile.id],
          });
          console.log("Host Profile updated for", profile.fullname);
        }
      })
      .subscribed(() => {
        console.log("Subscribed to profile updates");
      })
      .error((error) => {
        console.log("Error", error);
        // Alert.alert(
        //   "Error subscribing to profile updates",
        //   error.message,
        // );
      });
  }, []);

  useEffect(() => {
    return () => {
      const channelName = profileUpdateListener.current?.name;
      if (channelName) {
        PusherEcho.leave(channelName);
        console.log("Unsubscribed from profile updates");
      }
    };
  }, []);

  return { subscribeToProfileUpdates, unsubscribeFromProfileUpdates };
};

export default useProfileUpdates;
