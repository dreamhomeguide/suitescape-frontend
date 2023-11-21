import { Slider } from "@miblanchard/react-native-slider";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

import style from "./VideoItemProgressBarStyles";
import { useVideoScroll } from "../../contexts/VideoScrollContext";

const VideoItemProgressBar = ({
  videoRef,
  duration,
  progress,
  visible,
  trackMarks,
}) => {
  const [isSeeking, setIsSeeking] = useState(false);

  // const marks = useMemo(() => {
  //   return trackMarks?.map((mark) => mark * 1000);
  // }, [trackMarks]);

  const timeoutRef = useRef(null);

  const { setIsScrollEnabled } = useVideoScroll();

  const trackHeight = useRef(new Animated.Value(3)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(trackHeight, {
      toValue: isSeeking ? 8 : 3,
      useNativeDriver: false,
    }).start();

    Animated.spring(opacity, {
      toValue: isSeeking || visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isSeeking, visible]);

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

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
    }, 800);

    setIsScrollEnabled && setIsScrollEnabled(true);

    if (!videoRef.current.isClickPaused) {
      videoRef.current.video.playAsync();
    }
  };

  return (
    <Animated.View
      style={{
        ...style.mainContainer,
        ...(!visible && !isSeeking && { opacity }),
      }}
    >
      <Slider
        value={progress}
        animationType="timing"
        animateTransitions
        onValueChange={onValueChange}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        maximumValue={duration}
        maximumTrackStyle={style.track}
        trackStyle={{ height: trackHeight }}
        minimumTrackTintColor={undefined}
        maximumTrackTintColor="white"
        thumbStyle={isSeeking ? style.thumb : { height: 0, width: 0 }}
        containerStyle={style.sliderContainer}
        // Date time marks like 00:00, 00:30, 01:30, etc. should be done in backend (Laravel)
        // Thumbnails for these marks should be done in frontend (React native)
        trackMarks={trackMarks}
        renderTrackMarkComponent={() => {
          if (!trackMarks || trackMarks.length === 0) {
            return null;
          }

          return (
            <Animated.View
              style={{
                ...style.trackMark,
                ...(!isSeeking && {
                  height: trackHeight,
                  left: -10,
                }),
              }}
            />
          );
        }}
      />
    </Animated.View>
  );
};

export default VideoItemProgressBar;
