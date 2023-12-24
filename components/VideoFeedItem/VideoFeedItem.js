import React, { memo, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { PaperProvider, Portal } from "react-native-paper";

import { SocialActionsProvider } from "../../contexts/SocialActionsContext";
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

  const { cachedUri } = useCachedMedia(
    "videos/",
    videoId + "." + fileExtension,
    baseURL + videoUrl,
  );
  const { width } = useWindowDimensions();

  // Resets video to beginning when video is no longer in focus
  useEffect(() => {
    if (feedFocused && !videoInFocus && isVideoLoaded) {
      (async () => videoRef.current?.video.setPositionAsync(0))();
      videoRef.current?.setIsClickPaused(false);
      setIsSectionShown(false);
    }
  }, [feedFocused, isVideoLoaded, videoInFocus]);

  // Destructure listing object to provide for SocialActionsContext
  const {
    id: listingId,
    host_id: hostId,
    is_liked: isLiked,
    is_saved: isSaved,
    likes_count: likesCount,
  } = listing;

  return (
    <SocialActionsProvider
      hostId={hostId}
      listingId={listingId}
      currentIsLiked={isLiked}
      currentIsSaved={isSaved}
      currentLikesCount={likesCount}
    >
      <PaperProvider>
        <VideoItem
          ref={videoRef}
          videoUri={cachedUri}
          shouldPlay={feedFocused && videoInFocus}
          width={width}
          height={height}
          onPlaybackUpdate={({ isLoaded, durationMillis, positionMillis }) => {
            setIsVideoLoaded(isLoaded);
            if (durationMillis) {
              setDuration(durationMillis);
            }
            if (!isSeeking) {
              setCurrentProgress(positionMillis);
            }
          }}
          onClearMode={(clearMode) => setClearMode(clearMode)}
        />

        {!clearMode && (
          <VideoListingIconsView
            hostId={hostId}
            listingId={listingId}
            onShowModal={() => setIsSectionShown(true)}
            previewMode={previewMode}
          />
        )}

        {!previewMode && !clearMode && (
          <VideoListingDetails listing={listing} />
        )}

        <Portal>
          <ModalSection
            visible={isSectionShown}
            onDismiss={() => setIsSectionShown(false)}
            videoUri={cachedUri}
            duration={duration}
            progress={currentProgress}
            isVideoSeeking={isSeeking}
            onItemPress={(time) => {
              videoRef.current?.video
                .setPositionAsync(time, {
                  toleranceMillisBefore: 0,
                  toleranceMillisAfter: 0,
                })
                .catch((err) => console.log("Error seeking section:", err));
              videoRef.current?.setIsClickPaused(false);
            }}
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
      </PaperProvider>
    </SocialActionsProvider>
  );
};

export default memo(VideoFeedItem);
