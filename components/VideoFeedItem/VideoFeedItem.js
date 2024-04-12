import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { PaperProvider, Portal } from "react-native-paper";

import globalStyles from "../../assets/styles/globalStyles";
import useCachedMedia from "../../hooks/useCachedMedia";
import { baseURL } from "../../services/SuitescapeAPI";
import ModalSection from "../ModalSection/ModalSection";
import VideoItem from "../VideoItem/VideoItem";
import VideoItemProgressBar from "../VideoItemProgressBar/VideoItemProgressBar";
import VideoListingDetails from "../VideoListingDetails/VideoListingDetails";
import VideoListingIconsView from "../VideoListingIconsView/VideoListingIconsView";

const SAMPLE_MARKS = [1000, 5000, 10000, 15000, 22000, 30000, 40000, 50000];

const VideoFeedItem = ({
  videoId,
  videoUrl,
  videoFileName,
  height,
  listing,
  feedFocused,
  videoInFocus,
  previewMode,
}) => {
  const [duration, setDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isSectionShown, setIsSectionShown] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [clearMode, setClearMode] = useState(false);

  const videoRef = useRef(null);

  const fileExtension = videoFileName.split(".").pop();

  const { cachedUri, clearCache } = useCachedMedia(
    "videos/",
    videoId + "." + fileExtension,
    baseURL + videoUrl,
  );

  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const {
    id: listingId,
    host: { id: hostId, picture_url: hostPictureUrl },
    is_liked: isLiked,
    is_saved: isSaved,
    likes_count: likesCount,
  } = listing;

  useEffect(() => {
    queryClient.setQueryData(["listings", listingId, "social"], {
      host: { id: hostId },
      is_liked: isLiked,
      is_saved: isSaved,
      likes_count: likesCount,
    });
  }, [hostId, isLiked, isSaved, likesCount, listingId, queryClient]);

  // Resets video to beginning when video is no longer in focus
  useEffect(() => {
    // Delay resetting video to beginning so user can go back from previous progress
    const timeout = setTimeout(() => {
      if (feedFocused && !videoInFocus && isVideoLoaded) {
        (async () => videoRef.current?.video.setPositionAsync(0))();
        videoRef.current?.setIsClickPaused(false);
        setIsSectionShown(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [feedFocused, videoInFocus]);

  const onShowModal = useCallback(() => {
    setIsSectionShown(true);
  }, []);

  const onModalDismiss = useCallback(() => {
    setIsSectionShown(false);
  }, []);

  const onItemPress = useCallback((time) => {
    videoRef.current?.video
      .setPositionAsync(time, {
        toleranceMillisBefore: 0,
        toleranceMillisAfter: 0,
      })
      .catch((err) => console.log("Error seeking section:", err));
    videoRef.current?.setIsClickPaused(false);
  }, []);

  const onPlaybackStatusUpdate = useCallback(
    ({ isLoaded, durationMillis, positionMillis }) => {
      setIsVideoLoaded(isLoaded);

      if (durationMillis) {
        setDuration(durationMillis);
      }
      if (!isSeeking) {
        setCurrentProgress(positionMillis);
      }
    },
    [isSeeking],
  );

  return (
    <PaperProvider>
      <VideoItem
        ref={videoRef}
        videoUri={cachedUri}
        shouldPlay={feedFocused && videoInFocus}
        width={width}
        height={height}
        onPlaybackUpdate={onPlaybackStatusUpdate}
        onError={clearCache}
        onClearMode={setClearMode}
        listingId={listingId}
      />

      {!clearMode && (
        <VideoListingIconsView
          hostId={hostId}
          hostPictureUrl={hostPictureUrl}
          listingId={listingId}
          onShowModal={onShowModal}
          previewMode={previewMode}
        />
      )}

      {!previewMode && !clearMode && <VideoListingDetails listing={listing} />}
      <Portal>
        <ModalSection
          visible={isSectionShown}
          onDismiss={onModalDismiss}
          videoUri={cachedUri}
          duration={duration}
          progress={currentProgress}
          isVideoSeeking={isSeeking}
          onItemPress={onItemPress}
          trackMarks={SAMPLE_MARKS}
        />

        <VideoItemProgressBar
          visible={videoRef.current?.isClickPaused || isSectionShown}
          videoRef={videoRef}
          duration={duration}
          progress={currentProgress}
          onSeekStart={() => {
            setIsSeeking(true);
          }}
          onProgressChange={(val) => {
            setCurrentProgress(val);
            setIsSeeking(true);
          }}
          onSeekEnd={() => {
            setIsSeeking(false);
          }}
          trackMarks={SAMPLE_MARKS}
        />
      </Portal>

      {!clearMode && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          locations={[0.6, 1]}
          pointerEvents="none"
          style={{ height, ...globalStyles.absoluteBottom }}
        />
      )}
    </PaperProvider>
  );
};

export default memo(VideoFeedItem);
