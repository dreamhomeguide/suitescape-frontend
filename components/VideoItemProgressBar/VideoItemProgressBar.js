import { Slider } from "@miblanchard/react-native-slider";
import { format } from "date-fns";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Text, View } from "react-native";
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
  sections,
  showTimeStamp,
}) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekedProgress, setSeekedProgress] = useState(progress || 0);

  const trackMarks = useMemo(
    () => sections?.map((section) => section.milliseconds),
    [sections],
  );

  const progressTimeoutRef = useRef(null);
  const visibilityTimeoutRef = useRef(null);
  const trackHeight = useRef(new Animated.Value(3)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(trackHeight, {
      toValue: isSeeking ? 8 : 3,
      useNativeDriver: false,
      speed: 10,
    }).start();

    Animated.spring(opacity, {
      toValue: isSeeking || visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isSeeking, visible]);

  useEffect(() => {
    return () => {
      clearTimeout(progressTimeoutRef.current);
      clearTimeout(visibilityTimeoutRef.current);
    };
  }, []);

  const onValueChange = useCallback(
    (val) => {
      const newProgress = val[0];

      !isSeeking && setIsSeeking(true);
      onProgressChange && onProgressChange(newProgress);
      setSeekedProgress(newProgress);

      // Clear the previous timeout if it exists
      clearTimeout(progressTimeoutRef.current);

      // Set a new timeout to call setPositionAsync after a delay
      progressTimeoutRef.current = setTimeout(() => {
        videoRef?.current?.video
          ?.setPositionAsync(newProgress, {
            toleranceMillisBefore: 0,
            toleranceMillisAfter: 0,
          })
          .catch((err) => {
            console.log("Error seeking section:", err);
          });
      }, 100);
    },
    [isSeeking, onProgressChange],
  );

  const onSlidingStart = useCallback(
    (val) => {
      // setShouldVideoScroll && setShouldVideoScroll(false);

      setIsSeeking(true);
      onProgressChange && onProgressChange(val[0]);
      setSeekedProgress(val[0]);
      onSeekStart && onSeekStart();

      if (!videoRef?.current?.isClickPaused) {
        videoRef?.current?.video?.pauseAsync();
      }
    },
    [onSeekStart],
  );

  const onSlidingComplete = useCallback(() => {
    // Clear timeout if it exists
    clearTimeout(visibilityTimeoutRef.current);

    // Set timeout to hide progress bar
    visibilityTimeoutRef.current = setTimeout(() => {
      setIsSeeking(false);
      onSeekEnd && onSeekEnd();
    }, 300); // Increase timeout if its flickering

    // setShouldVideoScroll && setShouldVideoScroll(true);

    // Don't play video after seeking if it was paused
    // if (!videoRef.current.isClickPaused) {
    //   videoRef.current.video.playAsync();
    // }

    // Play video after seeking
    videoRef?.current?.video?.playAsync();
    videoRef?.current?.setIsClickPaused?.(false);
  }, [onSeekEnd]);

  const trackMarkStyle = useMemo(
    () => ({
      ...style.trackMark,
      ...(!isSeeking && { height: trackHeight, left: -13 }),
    }),
    [isSeeking],
  );

  const renderTrackMarkComponent = useCallback(() => {
    if (!sections || sections.length === 0) {
      return null;
    }

    return <Animated.View style={trackMarkStyle} />;
  }, [sections, trackMarkStyle]);

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
        <View
          style={{
            ...style.contentContainer,
            ...(showTimeStamp && { paddingLeft: 10 }),
          }}
        >
          <Slider
            value={isSeeking ? seekedProgress : progress}
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
            trackMarks={trackMarks}
            renderTrackMarkComponent={renderTrackMarkComponent}
          />

          {showTimeStamp && (
            <Text style={style.timeStamp}>
              {progress ? format(progress, "m:ss") : "-:--"}/
              {duration ? format(duration, "mm:ss") : "--:--"}
            </Text>
          )}
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

export default memo(VideoItemProgressBar);
