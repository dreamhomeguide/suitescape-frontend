import Icon from "@expo/vector-icons/FontAwesome5";
import { ResizeMode, Video } from "expo-av";
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Dimensions, Pressable, View } from "react-native";

import style from "./VideoItemStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { useAuth } from "../../contexts/AuthContext";
import useCachedMedia from "../../hooks/useCachedMedia";
import { baseURLWithoutApi } from "../../services/SuitescapeAPI";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const VideoItem = forwardRef(
  (
    {
      videoId,
      videoUrl,
      fileExtension,
      height,
      width = WINDOW_WIDTH,
      iconSize = 55,
      initialIsPaused = false,
      initialIsMuted = false,
      onPlaybackUpdate,
      shouldPlay,
    },
    ref,
  ) => {
    const [status, setStatus] = useState({});
    const [isPaused, setIsPaused] = useState(initialIsPaused);
    const [isMuted, setIsMuted] = useState(initialIsMuted);

    const { userToken } = useAuth();

    const videoRef = useRef(null);

    const { cachedUri } = useCachedMedia(
      "videos/",
      videoId + "." + fileExtension,
      baseURLWithoutApi + videoUrl,
    );

    useImperativeHandle(ref, () => ({
      video: videoRef.current,

      // Functions to simulate a pause click on the video
      isClickPaused: isPaused,
      setIsClickPaused: setIsPaused,

      // Functions to simulate a mute click on the video
      isClickMuted: isMuted,
      setIsClickMuted: setIsMuted,
    }));

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

    return (
      <Pressable onPress={togglePauseOrUnmute}>
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
        {status.isBuffering && (
          <View style={globalStyles.absoluteCenter}>
            <ActivityIndicator size="large" style={style.iconOpacity} />
          </View>
        )}
        <Video
          ref={videoRef}
          source={{
            uri: cachedUri,
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }}
          onPlaybackStatusUpdate={(playbackStatus) => {
            setStatus(() => playbackStatus);
            onPlaybackUpdate && onPlaybackUpdate(playbackStatus);
          }}
          shouldPlay={status.isLoaded && shouldPlay && !isPaused}
          isMuted={isMuted}
          isLooping
          resizeMode={ResizeMode.COVER}
          style={{ width, height }}
        />
      </Pressable>
    );
  },
);

export default memo(VideoItem);
