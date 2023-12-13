import { format } from "date-fns";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Text } from "react-native";
import { useTheme, Modal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ModalSectionStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ModalSectionItem from "../ModalSectionItem/ModalSectionItem";

const { width } = Dimensions.get("window");

const ITEM_IMAGE_SIZE = width / 6;
const ITEM_DETAILS_WIDTH = 83;

const ITEM_SIZE = ITEM_IMAGE_SIZE + ITEM_DETAILS_WIDTH;

const ModalSection = ({
  visible,
  onDismiss,
  videoUri,
  duration,
  progress,
  trackMarks,
  isVideoSeeking,
  onItemPress,
}) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [modalReady, setModalReady] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [areThumbnailsLoaded, setAreThumbnailsLoaded] = useState(false);
  const [didThumbnailError, setDidThumbnailError] = useState(false);

  const flatlistRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const modalTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      backdrop: "rgba(0,0,0,0.2)",
    },
  };

  const filteredTrackMarks = useMemo(
    () => trackMarks.filter((mark) => mark <= duration),
    [duration, trackMarks],
  );

  const getThumbnails = async () => {
    console.log("Getting thumbnails…", videoUri);
    try {
      const thumbnailPromises = filteredTrackMarks.map((mark) =>
        VideoThumbnails.getThumbnailAsync(videoUri, {
          time: mark,
        }),
      );

      const thumbnails = await Promise.all(thumbnailPromises);
      setThumbnails(thumbnails.map((thumbnail) => thumbnail.uri));

      setDidThumbnailError(false);
    } catch (err) {
      console.log("Error getting thumbnail:", err);
      setDidThumbnailError(true);
    } finally {
      setAreThumbnailsLoaded(true);
    }
  };

  // Get thumbnails when modal is ready
  useEffect(() => {
    let timeout;

    // This will run in 2 cases:
    // If modal is ready but thumbnails are not loaded, get thumbnails
    // If thumbnails are loaded and there was an error, try again (run based on cached uri)
    if (modalReady && (!areThumbnailsLoaded || didThumbnailError)) {
      if (didThumbnailError) {
        console.log(
          "There was an error but trying again because of cached uri…",
        );
      }
      timeout = setTimeout(() => {
        getThumbnails().then(() => {
          console.log("Got thumbnails!");
        });
      }, 200);
    }

    return () => timeout && clearTimeout(timeout);
  }, [modalReady, videoUri]);

  const scrollToCurrentSection = ({ animated }) => {
    if (
      !isVideoSeeking &&
      !isScrolling &&
      areThumbnailsLoaded &&
      progress &&
      duration
    ) {
      const index = trackMarks.findIndex((mark) => mark > progress);

      if (index < 0) {
        flatlistRef.current?.scrollToEnd({
          animated,
        });
        return;
      }

      if (index === 0) {
        flatlistRef.current?.scrollToIndex({
          index: 0,
          animated,
        });
        return;
      }

      flatlistRef.current?.scrollToIndex({
        index: index - 1,
        animated,
        viewPosition: 0.5,
      });
    }
  };

  useEffect(() => {
    scrollToCurrentSection({ animated: true });
  }, [progress]);

  const stopScrollingAfterDelay = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      transparent
      onDismiss={onDismiss}
      contentContainerStyle={style.mainContainer({
        bottomInsets: insets.bottom,
      })}
      theme={modalTheme}
    >
      <Text style={style.headerText}>Sections</Text>

      {!areThumbnailsLoaded && (
        <ActivityIndicator
          size="large"
          style={{
            backgroundColor: "rgba(255,255,255,0.4)",
            ...globalStyles.absoluteCenter,
          }}
        />
      )}

      <FlatList
        ref={flatlistRef}
        onLayout={() => {
          setModalReady(true);
          scrollToCurrentSection({ animated: false });
        }}
        data={filteredTrackMarks}
        contentContainerStyle={{
          columnGap: 10,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        onTouchStart={() => setIsScrolling(true)}
        onTouchEnd={stopScrollingAfterDelay}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={stopScrollingAfterDelay}
        keyExtractor={(item) => item.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <ModalSectionItem
            index={index + 1}
            time={item}
            label="Room"
            thumbnailUri={thumbnails[index]}
            isActive={
              !isVideoSeeking &&
              progress >= item &&
              (!trackMarks[index + 1] || progress < trackMarks[index + 1])
            }
            onPress={(time) => {
              onItemPress && onItemPress(time);
              flatlistRef.current.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
              });
            }}
          />
        )}
      />

      <Text style={style.progressText}>
        {progress ? format(progress, "m:ss") : "-:--"}/
        {duration ? format(duration, "mm:ss") : "--:--"}
      </Text>
    </Modal>
  );
};

export default memo(ModalSection);
