import React, { memo, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { PaperProvider, Portal } from "react-native-paper";

import { SocialActionsProvider } from "../../contexts/SocialActionsContext";
import ModalSection from "../ModalSection/ModalSection";
import VideoItem from "../VideoItem/VideoItem";
import VideoItemProgressBar from "../VideoItemProgressBar/VideoItemProgressBar";
import VideoListingDetails from "../VideoListingDetails/VideoListingDetails";
import VideoListingIconsView from "../VideoListingIconsView/VideoListingIconsView";

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

  const videoRef = useRef(null);
  const { width } = useWindowDimensions();

  const fileExtension = videoFileName.split(".").pop();

  useEffect(() => {
    if (feedFocused && !videoInFocus && isVideoLoaded) {
      videoRef.current.video.setPositionAsync(0);
      videoRef.current.setIsClickPaused(false);
    }
  }, [feedFocused, isVideoLoaded, videoInFocus]);

  return (
    <SocialActionsProvider listingData={listing}>
      <PaperProvider>
        <VideoItem
          ref={videoRef}
          videoId={videoId}
          videoUrl={videoUrl}
          fileExtension={fileExtension}
          shouldPlay={videoInFocus}
          width={width}
          height={height}
          onPlaybackUpdate={({ isLoaded, durationMillis, positionMillis }) => {
            setIsVideoLoaded(isLoaded);
            setDuration(durationMillis);
            setCurrentProgress(positionMillis);
          }}
        />

        <VideoListingIconsView
          listingId={listing.id}
          onShowModal={() => setIsSectionShown(true)}
          previewMode={previewMode}
        />

        {!previewMode && <VideoListingDetails listing={listing} />}

        <Portal>
          <ModalSection
            visible={isSectionShown}
            onDismiss={() => setIsSectionShown(false)}
            duration={duration}
            progress={currentProgress}
          />
          <VideoItemProgressBar
            visible={videoRef.current?.isClickPaused || isSectionShown}
            videoRef={videoRef}
            duration={duration}
            progress={currentProgress}
          />
        </Portal>
      </PaperProvider>
    </SocialActionsProvider>
  );
};

export default memo(VideoFeedItem);
