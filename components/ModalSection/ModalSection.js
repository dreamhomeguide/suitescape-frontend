import { format } from "date-fns";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, Text, View } from "react-native";
import { useTheme, Modal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./ModalSectionStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ModalSectionItem from "../ModalSectionItem/ModalSectionItem";

const BATCH_SIZE = 1;
const BATCH_DELAY = 200;

const ITEM_IMAGE_WIDTH = 100;
const ITEM_DETAILS_WIDTH = 80;
const ITEM_GAP = 10;

const ITEM_SIZE = ITEM_IMAGE_WIDTH + ITEM_DETAILS_WIDTH + ITEM_GAP;

const ModalSection = ({
  visible,
  onDismiss,
  videoUri,
  duration,
  progress,
  sections,
  isVideoSeeking,
  onItemPress,
}) => {
  const [isGettingThumbnails, setIsGettingThumbnails] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [modalReady, setModalReady] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [areThumbnailsLoaded, setAreThumbnailsLoaded] = useState(false);
  const [didThumbnailError, setDidThumbnailError] = useState(false);
  const [lastBatchIndex, setLastBatchIndex] = useState(0);

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

  // Sort and filter sections based on duration
  const trackMarks = useMemo(
    () =>
      sections
        ?.sort((a, b) => a.milliseconds - b.milliseconds)
        .filter((section) => section.milliseconds <= duration),
    [duration, sections],
  );

  // Reset last batch index when track marks change
  useEffect(() => {
    if (lastBatchIndex > 0) {
      console.log("Track marks changed. Resetting last batch index…");
      setLastBatchIndex(0);
    }
  }, [trackMarks]);

  const getThumbnails = async () => {
    if (isGettingThumbnails) {
      console.log("Already getting thumbnails…");
      return;
    }
    setIsGettingThumbnails(true);
    console.log("Getting thumbnails…", videoUri);

    try {
      // Create batches from track marks
      const batches = [];
      for (let i = 0; i < trackMarks.length; i += BATCH_SIZE) {
        batches.push(trackMarks.slice(i, i + BATCH_SIZE));
      }

      // Process each batch
      for (let i = lastBatchIndex; i < batches.length; i++) {
        const batch = batches[i];

        if (!flatlistRef.current) {
          console.log("Modal is not visible, stopping thumbnail fetch…");
          setLastBatchIndex(i);
          setDidThumbnailError(true);
          return;
        }

        const thumbnailPromises = batch.map((section) =>
          VideoThumbnails.getThumbnailAsync(videoUri, {
            time: section.milliseconds,
          }),
        );
        const thumbnails = await Promise.all(thumbnailPromises);

        setThumbnails((prevThumbnails) => [
          ...prevThumbnails,
          ...thumbnails.map((thumbnail) => thumbnail.uri),
        ]);

        // Wait before getting next batch
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }

      setDidThumbnailError(false);
    } catch (err) {
      console.log("Error getting thumbnail:", err);
      setDidThumbnailError(true);
    } finally {
      console.log("Done getting thumbnails!");
      setAreThumbnailsLoaded(true);
      setIsGettingThumbnails(false);
    }
  };

  // Get thumbnails when modal and sections are ready
  useEffect(() => {
    let timeout;

    // This will run in 3 cases:
    // If modal is ready but thumbnails are not loaded, get thumbnails
    // If thumbnails are loaded and there was an error, try again (run based on cached uri)
    // If modal was closed and thumbnails were not finished loading, try again (run based on batch index)
    if (
      visible &&
      modalReady &&
      sections &&
      (!areThumbnailsLoaded || didThumbnailError)
    ) {
      if (didThumbnailError) {
        console.log("There was an error so trying again…");
      }
      // Waits for the modal to open before getting thumbnails
      timeout = setTimeout(() => {
        getThumbnails();
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [modalReady, sections, videoUri, visible]);

  const scrollToCurrentSection = ({ animated }) => {
    if (
      !isVideoSeeking &&
      !isScrolling &&
      areThumbnailsLoaded &&
      sections &&
      progress &&
      duration
    ) {
      const index = sections.findIndex(
        (section) => section.milliseconds > progress,
      );

      if (index === -1) {
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
        index: index <= 0 ? 0 : index - 1,
        animated,
        viewPosition: 0.5,
      });
    }
  };

  useEffect(() => {
    scrollToCurrentSection({ animated: true });
  }, [progress]);

  const stopScrollingAfterDelay = useCallback(() => {
    clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <ModalSectionItem
        index={index + 1}
        time={item.milliseconds}
        label={item.label}
        thumbnailUri={thumbnails[index]}
        isActive={
          !isVideoSeeking &&
          progress >= item.milliseconds &&
          (!sections[index + 1] || progress < sections[index + 1].milliseconds)
        }
        onPress={() => {
          onItemPress && onItemPress(item.milliseconds);
          flatlistRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }}
        width={ITEM_SIZE - ITEM_GAP}
        imageWidth={ITEM_IMAGE_WIDTH}
        detailsWidth={ITEM_DETAILS_WIDTH}
      />
    ),
    [isVideoSeeking, progress, thumbnails, sections],
  );

  const getItemLayout = useCallback(
    (_, idx) => ({
      length: ITEM_SIZE,
      offset: ITEM_SIZE * idx,
      index: idx,
    }),
    [],
  );

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

      {/*{(isGettingThumbnails || !areThumbnailsLoaded) && (*/}
      {/*  <ActivityIndicator*/}
      {/*    size="large"*/}
      {/*    style={{*/}
      {/*      backgroundColor: "rgba(255,255,255,0.4)",*/}
      {/*      ...globalStyles.absoluteCenter,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}

      <FlatList
        ref={flatlistRef}
        onLayout={() => {
          setModalReady(true);
          scrollToCurrentSection({ animated: false });
        }}
        data={trackMarks}
        contentContainerStyle={{
          columnGap: ITEM_GAP,
        }}
        horizontal={sections?.length > 0}
        showsHorizontalScrollIndicator={false}
        onTouchStart={() => setIsScrolling(true)}
        onTouchEnd={stopScrollingAfterDelay}
        onMomentumScrollEnd={stopScrollingAfterDelay}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={globalStyles.flexCenter}>
            <Text style={globalStyles.emptyTextCenter}>
              No sections available.
            </Text>
          </View>
        }
      />

      <Text style={style.progressText}>
        {progress ? format(progress, "m:ss") : "-:--"}/
        {duration ? format(duration, "mm:ss") : "--:--"}
      </Text>
    </Modal>
  );
};

export default memo(ModalSection);
