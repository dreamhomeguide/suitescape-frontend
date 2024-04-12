import { Slider } from "@miblanchard/react-native-slider";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import style from "./VideoItemProgressBarStyles";

const VideoItemProgressBar = ({
  videoRef,
  duration,
  progress,
  onProgressChange,
  onSeekStart,
  onSeekEnd,
  visible,
  trackMarks,
}) => {
  const [isSeeking, setIsSeeking] = useState(false);

  // const marks = useMemo(() => {
  //   return trackMarks?.map((mark) => mark * 1000);
  // }, [trackMarks]);

  const timeoutRef = useRef(null);
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
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const onValueChange = useCallback(
    (val) => {
      !isSeeking && setIsSeeking(true);
      onProgressChange && onProgressChange(val[0]);

      videoRef?.current?.video
        .setPositionAsync(val[0], {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        })
        .catch(() => {}); // Don't show error
    },
    [isSeeking, onProgressChange],
  );

  const onSlidingStart = useCallback(() => {
    // setShouldVideoScroll && setShouldVideoScroll(false);
    setIsSeeking(true);
    onSeekStart && onSeekStart();

    if (!videoRef?.current?.isClickPaused) {
      videoRef.current.video.pauseAsync();
    }
  }, [onSeekStart]);

  const onSlidingComplete = useCallback(() => {
    // Clear timeout if it exists
    clearTimeout(timeoutRef.current);

    // Set timeout to hide progress bar
    timeoutRef.current = setTimeout(() => {
      setIsSeeking(false);
      onSeekEnd && onSeekEnd();
    }, 300); // Increase timeout if its flickering

    // setShouldVideoScroll && setShouldVideoScroll(true);

    // Don't play video after seeking if it was paused
    // if (!videoRef.current.isClickPaused) {
    //   videoRef.current.video.playAsync();
    // }

    // Play video after seeking
    videoRef?.current?.video.playAsync();
    videoRef?.current?.setIsClickPaused(false);
  }, [onSeekEnd]);

  const trackMarkStyle = useMemo(
    () => ({
      ...style.trackMark,
      ...(!isSeeking && { height: trackHeight, left: -13 }),
    }),
    [isSeeking],
  );

  const renderTrackMarkComponent = useCallback(() => {
    if (!trackMarks || trackMarks.length === 0) {
      return null;
    }

    return <Animated.View style={trackMarkStyle} />;
  }, [trackMarks, trackMarkStyle]);

  const nativeGesture = useMemo(() => Gesture.Native(), []);
  const panGesture = useMemo(() => Gesture.Pan(), []);
  const composed = useMemo(() => Gesture.Race(nativeGesture, panGesture), []);

  return (
    <Animated.View
      style={{
        ...style.mainContainer,
        ...(!visible && !isSeeking && { opacity }),
      }}
    >
      <GestureDetector gesture={composed}>
        <Slider
          value={progress}
          animationType="timing"
          animateTransitions
          onValueChange={onValueChange}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          maximumValue={duration}
          trackStyle={{ height: trackHeight }}
          maximumTrackStyle={style.track}
          maximumTrackTintColor="white"
          minimumTrackTintColor={undefined}
          thumbStyle={isSeeking ? style.thumb : style.noThumb}
          containerStyle={style.sliderContainer}
          // Date time marks like 00:00, 00:30, 01:30, etc. should be done in backend (Laravel)
          // Thumbnails for these marks should be done in frontend (React native)
          trackMarks={trackMarks}
          renderTrackMarkComponent={renderTrackMarkComponent}
        />
      </GestureDetector>
    </Animated.View>
  );
};

export default memo(VideoItemProgressBar);
