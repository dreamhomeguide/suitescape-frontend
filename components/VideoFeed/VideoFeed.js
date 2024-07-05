import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dimensions, FlatList, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import VideoFeedItem from "../VideoFeedItem/VideoFeedItem";

// const VIEWABILITY_CONFIG = {
//   // Adjust this if onViewableItemsChanged is not working properly
//   itemVisiblePercentThreshold: 80,
//
//   minimumViewTime: 20,
// };

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const VideoFeed = forwardRef(
  (
    {
      height = WINDOW_HEIGHT,
      videos,
      currentListing,
      refreshControl,
      onEndReached,
      bottomTabHeight,
      scrollEnabled = true,
    },
    ref,
  ) => {
    const [index, setIndex] = useState(null);
    const [lastPlayedIndex, setLastPlayedIndex] = useState(null);

    const flatListRef = useRef(null);

    const insets = useSafeAreaInsets();
    const isFeedFocused = useIsFocused();

    // Adds top padding on android devices with a notch
    const topPadding =
      Platform.OS === "android" && insets.top > 25 ? insets.top : 0;

    // Adds bottom inset if the bottom tab bar is not present
    const bottomInset = bottomTabHeight ?? insets.bottom;

    // Adjusts the height of the video to fit the screen
    const videoHeight = height + topPadding - bottomInset;

    const resetIndex = useCallback(() => {
      setLastPlayedIndex(null);
      setIndex(null);
    }, []);

    useImperativeHandle(ref, () => ({
      list: flatListRef.current,
      resetIndex,
    }));

    // Plays the last played video when the feed is focused, and pauses it when it is not
    useFocusEffect(
      useCallback(() => {
        // If there are no videos, don't do anything
        if (!videos) {
          return;
        }

        if (lastPlayedIndex !== null) {
          // Uses the last played video index to resume playing
          // Also sets the first video to play on initial load
          setIndex(lastPlayedIndex);
        } else {
          setIndex(videos[0]?.id);
        }

        return () => {
          setIndex(null);
        };
      }, [lastPlayedIndex, videos]),
    );

    useFocusEffect(
      useCallback(() => {
        (async () => {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          }).catch((error) => console.log("Error setting audio mode:", error));
        })();

        // return () => {
        //   (async () => {
        //     await Audio.setAudioModeAsync({
        //       interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        //       interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        //     });
        //   })();
        // };
      }, []),
    );

    useFocusEffect(
      useCallback(() => {
        if (Platform.OS === "android") {
          (async () => {
            await NavigationBar.setBackgroundColorAsync("black");
          })();
        }

        return () => {
          if (Platform.OS === "android") {
            (async () => {
              await NavigationBar.setBackgroundColorAsync("white");
            })();
          }
        };
      }, []),
    );

    // const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    //   const firstViewableItem = viewableItems[0];
    //
    //   if (firstViewableItem?.isViewable) {
    //     // Sets the index of the video that is currently in focus
    //     const newIndex = firstViewableItem.item.id;
    //     setLastPlayedIndex(newIndex);
    //     setIndex(newIndex);
    //   }
    // }, []);

    // const viewabilityConfigCallbackPairs = useRef([
    //   {
    //     viewabilityConfig: VIEWABILITY_CONFIG,
    //     onViewableItemsChanged: handleViewableItemsChanged,
    //   },
    // ]);

    const getItemLayout = useCallback(
      (_, idx) => ({
        length: videoHeight,
        offset: videoHeight * idx,
        index: idx,
      }),
      [videoHeight],
    );

    const renderItem = useCallback(
      ({ item }) => (
        <VideoFeedItem
          videoId={item.id}
          videoUrl={item.url}
          videoFileName={item.filename}
          videoSections={item.sections}
          height={videoHeight}
          listing={currentListing ?? item.listing}
          previewMode={currentListing}
          videoInFocus={index ? index === item.id : false}
          feedFocused={isFeedFocused}
        />
      ),
      [currentListing, index, isFeedFocused, videoHeight],
    );

    const onScroll = useCallback(
      (e) => {
        if (!videos) {
          return;
        }

        const offsetY = e.nativeEvent.contentOffset.y;
        const newIndex = Math.floor(offsetY / videoHeight + 0.1);

        if (
          newIndex === index ||
          newIndex > videos.length - 1 ||
          newIndex < 0
        ) {
          return;
        }

        setIndex(videos[newIndex].id);
        setLastPlayedIndex(videos[newIndex].id);
      },
      [index, videoHeight, videos],
    );

    // const statusBarStyle = isFeedFocused ? "light" : "auto";

    // Applies to android only
    const statusBarColor = isFeedFocused ? "rgba(0,0,0,0.2)" : "transparent";

    return (
      <>
        <StatusBar style="light" backgroundColor={statusBarColor} translucent />

        {/*<LinearGradient*/}
        {/*  colors={["rgba(0,0,0,0.4)", "transparent"]}*/}
        {/*  locations={[0, 0.5]}*/}
        {/*  pointerEvents="none"*/}
        {/*  style={{ height: 100, ...globalStyles.absoluteTop }}*/}
        {/*/>*/}

        <FlatList
          ref={flatListRef}
          data={videos}
          scrollEnabled={scrollEnabled}
          initialNumToRender={5}
          windowSize={5}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={30}
          removeClippedSubviews
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          snapToInterval={videoHeight}
          snapToAlignment="center"
          decelerationRate="fast"
          refreshControl={refreshControl}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          disableIntervalMomentum
          // viewabilityConfigCallbackPairs={
          //   viewabilityConfigCallbackPairs.current
          // }
          getItemLayout={getItemLayout}
        />

        {!bottomTabHeight && <View style={{ height: bottomInset }} />}
      </>
    );
  },
);

export default memo(VideoFeed);
