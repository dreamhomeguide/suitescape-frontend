import Icon from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, AppState, Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Toast from "react-native-toast-notifications";

import style from "./VideoItemStyles";
import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import { useAuth } from "../../contexts/AuthContext";
import useSocialActions from "../../hooks/useSocialActions";

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
      onError,
      onClearMode,
      clearModeEnabled = true,
      likeEnabled = true,
      pauseEnabled = true,
      listingId,
    },
    ref,
  ) => {
    const [status, setStatus] = useState({});
    const [isPaused, setIsPaused] = useState(initialIsPaused);
    const [isMuted, setIsMuted] = useState(initialIsMuted);
    const [inBackground, setInBackground] = useState(false);

    const videoRef = useRef(null);
    const toastRef = useRef(null);

    const { isLiked, handleLike } = useSocialActions(listingId, true);
    const { authState } = useAuth();

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

    const togglePauseOrUnmute = useCallback(() => {
      if (status.isMuted) {
        setIsMuted(false);
        return;
      }

      // Pause if the video is playing
      setIsPaused(status.isPlaying);

      if (status.isPlaying) {
        videoRef.current?.pauseAsync();
      } else {
        videoRef.current?.playAsync();
      }
    }, [status.isMuted, status.isPlaying]);

    const likeVideo = useCallback(() => {
      // Prevents running if handleLike is not defined
      if (!handleLike) {
        return;
      }

      // Prevents liking the video if the user has already liked it
      if (!isLiked) {
        handleLike();
      }

      toastRef.current.hideAll();
      toastRef.current.show("", {
        icon: (
          <MaterialCommunityIcons
            name="heart"
            color={Colors.lightred}
            size={90}
            style={globalStyles.iconShadow}
          />
        ),
        style: { top: -50, backgroundColor: "transparent" },
        animationType: "zoom-in",
        duration: 500,
        placement: "center",
      });
    }, [handleLike, isLiked]);

    const singleTap = useMemo(
      () =>
        Gesture.Tap()
          .enabled(pauseEnabled)
          .numberOfTaps(1)
          .onEnd(() => {
            runOnJS(togglePauseOrUnmute)();
          }),
      [togglePauseOrUnmute],
    );

    const doubleTap = useMemo(
      () =>
        Gesture.Tap()
          .enabled(likeEnabled)
          .numberOfTaps(2)
          .onEnd(() => {
            runOnJS(likeVideo)();
          }),
      [likeVideo],
    );

    const longPan = useMemo(
      () =>
        Gesture.Pan()
          .enabled(clearModeEnabled)
          .activateAfterLongPress(500)
          .onStart(() => {
            runOnJS(Haptics.selectionAsync)();
            runOnJS(onClearMode)(true);
          })
          .onEnd(() => {
            runOnJS(onClearMode)(false);
          }),
      [],
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

          {!status.isLoaded ||
            (status.isBuffering && !status.isPlaying && (
              <View style={globalStyles.absoluteCenter}>
                <ActivityIndicator size="large" style={style.iconOpacity} />
              </View>
            ))}

          <Video
            ref={videoRef}
            source={{
              uri: videoUri,
              headers: {
                Authorization: "Bearer " + authState.userToken,
              },
            }}
            progressUpdateIntervalMillis={1000}
            onPlaybackStatusUpdate={(playbackStatus) => {
              setStatus(() => playbackStatus);
              onPlaybackUpdate && onPlaybackUpdate(playbackStatus);
            }}
            onError={(error) => {
              console.log("Error loading video:", error);
              onError && onError(error);
            }}
            shouldPlay={shouldVideoPlay}
            isMuted={isMuted}
            isLooping
            resizeMode={ResizeMode.COVER}
            style={{ width, height }}
          />

          <Toast ref={toastRef} />
        </View>
      </GestureDetector>
    );
  },
);

export default memo(VideoItem);
