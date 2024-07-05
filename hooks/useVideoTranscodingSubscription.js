import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import PusherEcho from "../services/PusherEcho";

const useVideoTranscodingSubscription = () => {
  const [allTranscodeProgress, setAllTranscodeProgress] = useState({});
  const videoTranscodingListener = useRef(null);
  const queryClient = useQueryClient();
  const {
    authState: { userId },
  } = useAuth();

  const unsubscribeFromVideoTranscoding = useCallback(() => {
    videoTranscodingListener.current?.stopListening(
      ".video-transcoding.progress",
    );
  }, []);

  const subscribeToVideoTranscoding = useCallback(() => {
    const channelName = "private-video-transcoding." + userId;

    // Unsubscribe from previous video transcoding updates first
    if (videoTranscodingListener.current) {
      unsubscribeFromVideoTranscoding();
    } else {
      videoTranscodingListener.current = PusherEcho.private(channelName);
    }

    videoTranscodingListener.current
      .listen(
        ".video-transcoding.progress",
        async ({ video, percentage, remaining, rate }) => {
          console.log(
            `Video transcoding progress for ${video.id} ${percentage}%`,
          );

          if (percentage === 100) {
            // Refetch the video data after transcoding is complete
            await queryClient.invalidateQueries({
              queryKey: ["listings", video.listing.id],
            });

            console.log("Video transcoding complete", video.id);
          }

          setAllTranscodeProgress((prevProgress) => ({
            ...prevProgress,
            [video.id]: { percentage, remaining, rate },
          }));
        },
      )
      .subscribed(() => {
        console.log("Subscribed to video transcoding progress updates");
      })
      .error((error) => {
        console.log("Error", error);
      });
  }, []);

  useEffect(() => {
    return () => {
      const channelName = videoTranscodingListener.current?.name;
      if (channelName) {
        PusherEcho.leave(channelName);
        console.log("Unsubscribed from video transcoding progress updates");
      }
    };
  }, []);

  return {
    subscribeToVideoTranscoding,
    unsubscribeFromVideoTranscoding,
    allTranscodeProgress,
  };
};

export default useVideoTranscodingSubscription;
