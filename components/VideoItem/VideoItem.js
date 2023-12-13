import Icon from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ResizeMode, Video } from "expo-av";
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, AppState, Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useToast } from "react-native-toast-notifications";

import style from "./VideoItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { useAuth } from "../../contexts/AuthContext";
import { useSocialActions } from "../../contexts/SocialActionsContext";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const VideoItem = forwardRef(
  (
    {
      videoUri,
      height,
      width = WINDOW_WIDTH,
      iconSize = 55,
      initialIsPaused = false,
      initialIsMuted = false,
      onPlaybackUpdate,
      shouldPlay,
      onClearMode,
      clearModeEnabled = true,
      likeEnabled = true,
      pauseEnabled = true,
    },
    ref,
  ) => {
    const [status, setStatus] = useState({});
    const [isPaused, setIsPaused] = useState(initialIsPaused);
    const [isMuted, setIsMuted] = useState(initialIsMuted);
    const [inBackground, setInBackground] = useState(false);

    const videoRef = useRef(null);

    const { userToken } = useAuth();
    const toast = useToast();
    const socialActionsContext = useSocialActions();
    const { isLiked, handleLike } = socialActionsContext || {};

    const shouldVideoPlay =
      status.isLoaded && shouldPlay && !isPaused && !inBackground;

    useImperativeHandle(ref, () => ({
      video: videoRef.current,

      // Functions to simulate a pause click on the video
      isClickPaused: isPaused,
      setIsClickPaused: setIsPaused,

      // Functions to simulate a mute click on the video
      isClickMuted: isMuted,
      setIsClickMuted: setIsMuted,
    }));

    // Pauses the video when the app is in the background
    useEffect(() => {
      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          setInBackground(!!nextAppState.match(/inactive|background/));
        },
      );

      return () => {
        subscription.remove();
      };
    }, []);

    const togglePauseOrUnmute = () => {
      if (status.isMuted) {
        setIsMuted(false);
        return;
      }

      // Pause if the video is playing
      setIsPaused(status.isPlaying);

      if (status.isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    };

    const likeVideo = () => {
      if (!isLiked) {
        handleLike && handleLike();
      }

      toast.hideAll();
      toast.show("", {
        icon: (
          <MaterialCommunityIcons
            name="heart"
            color="red"
            size={90}
            style={globalStyles.iconShadow}
          />
        ),
        style: { top: -50, backgroundColor: "transparent" },
        animationType: "zoom-in",
        duration: 500,
        placement: "center",
      });
    };

    const singleTap = useMemo(
      () =>
        Gesture.Tap()
          .enabled(pauseEnabled)
          .numberOfTaps(1)
          .onEnd(() => {
            runOnJS(togglePauseOrUnmute)();
          }),
      [status.isMuted, status.isPlaying],
    );

    const doubleTap = useMemo(
      () =>
        Gesture.Tap()
          .enabled(likeEnabled)
          .numberOfTaps(2)
          .onEnd(() => {
            runOnJS(likeVideo)();
          }),
      [isLiked],
    );

    const longPan = useMemo(
      () =>
        Gesture.Pan()
          .enabled(clearModeEnabled)
          .activateAfterLongPress(500)
          .onUpdate(() => {
            if (onClearMode) {
              runOnJS(onClearMode)(true);
            }
          })
          .onEnd(() => {
            if (onClearMode) {
              runOnJS(onClearMode)(false);
            }
          }),
      [onClearMode],
    );

    const composed = useMemo(
      () => Gesture.Exclusive(doubleTap, singleTap, longPan),
      [doubleTap, singleTap, longPan],
    );

    return (
      <GestureDetector gesture={composed}>
        <View>
          {isMuted && (
            <View
              style={{ ...globalStyles.absoluteCenter, ...style.actionButton }}
            >
              <Icon
                name="volume-mute"
                size={iconSize}
                color="white"
                style={style.iconOpacity}
              />
            </View>
          )}
          {isPaused && (
            <View
              style={{ ...globalStyles.absoluteCenter, ...style.actionButton }}
            >
              <Icon
                name="play"
                size={iconSize}
                color="white"
                style={style.iconOpacity}
              />
            </View>
          )}
          {status.isBuffering && !status.isPlaying && (
            <View style={globalStyles.absoluteCenter}>
              <ActivityIndicator size="large" style={style.iconOpacity} />
            </View>
          )}
          <Video
            ref={videoRef}
            source={{
              uri: videoUri,
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }}
            progressUpdateIntervalMillis={1000}
            onPlaybackStatusUpdate={(playbackStatus) => {
              setStatus(() => playbackStatus);
              onPlaybackUpdate && onPlaybackUpdate(playbackStatus);
            }}
            shouldPlay={shouldVideoPlay}
            isMuted={isMuted}
            isLooping
            resizeMode={ResizeMode.COVER}
            style={{ width, height }}
          />
        </View>
      </GestureDetector>
    );
  },
);

export default memo(VideoItem);
