import { Slider } from "@miblanchard/react-native-slider";
import React, { useRef, useState } from "react";
import { View } from "react-native";

import style from "./VideoItemProgressBarStyles";
import { useVideoScroll } from "../../contexts/VideoScrollContext";

const VideoItemProgressBar = ({ videoRef, duration, progress, visible }) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const timeoutRef = useRef(null);

  const { setIsScrollEnabled } = useVideoScroll();

  const onValueChange = (val) => {
    !isSeeking && setIsSeeking(true);
    videoRef.current.video
      .setPositionAsync(val[0], {
        toleranceMillisBefore: 0,
        toleranceMillisAfter: 0,
      })
      .catch((err) => console.log("Seeking error:", err.code));
  };

  const onSlidingStart = () => {
    setIsScrollEnabled && setIsScrollEnabled(false);
    setIsSeeking(true);
    if (!videoRef.current.isClickPaused) {
      videoRef.current.video.pauseAsync();
    }
  };

  const onSlidingComplete = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsSeeking(false);
    }, 1500);

    setIsScrollEnabled && setIsScrollEnabled(true);

    if (!videoRef.current.isClickPaused) {
      videoRef.current.video.playAsync();
    }
  };

  return (
    <View
      style={{
        ...style.mainContainer,
        ...(!visible && !isSeeking && { opacity: 0 }),
      }}
    >
      <Slider
        value={progress}
        onValueChange={onValueChange}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        maximumValue={duration}
        minimumTrackTintColor={undefined}
        maximumTrackTintColor="white"
        trackStyle={isSeeking ? style.largeTrack : style.smallTrack}
        thumbStyle={isSeeking ? style.thumb : style.noThumb}
        containerStyle={style.sliderContainer}
        // Date time marks like 00:00, 00:30, 01:30, etc. should be done in backend (Laravel)
        // Thumbnails for these marks should be done in frontend (React native)
        trackMarks={[]}
        renderTrackMarkComponent={() => {
          return (
            <View
              style={{
                ...style.trackMark,
                ...(!isSeeking && style.smallTrackMark),
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default VideoItemProgressBar;
