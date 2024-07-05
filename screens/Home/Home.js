import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, RefreshControl, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./HomeStyles";
import Fontello from "../../assets/fontello/Fontello";
import Deals from "../../assets/images/svgs/deals.svg";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import FloatingIcon from "../../components/FloatingIcon/FloatingIcon";
import HeaderIconView from "../../components/HeaderIconView/HeaderIconView";
import VideoFeed from "../../components/VideoFeed/VideoFeed";
import { useVideoFilters } from "../../contexts/VideoFiltersContext";
import useFetchVideos from "../../hooks/useFetchVideos";
import { Routes } from "../../navigation/Routes";

const Home = ({ navigation }) => {
  const [floatingIconEnabled, setFloatingIconEnabled] = useState(true);

  const {
    data: videos,
    isFetching,
    isFetchingNextPage,
    isFetched,
    fetchNextPage,
    isRefreshing,
    refresh,
  } = useFetchVideos();

  const { videoFilters } = useVideoFilters();
  const bottomTabHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const videoFeedRef = useRef(null);

  const dialogTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      backdrop: "rgba(0,0,0,0.3)",
    },
  };

  const scrollToTop = useCallback(
    (animated) =>
      videoFeedRef.current?.list.scrollToOffset({ offset: 0, animated }),
    [],
  );

  // Allows the feed to scroll to top when the tab is pressed
  useScrollToTop(useRef({ scrollToTop: () => scrollToTop(true) }));

  useEffect(() => {
    // Used timeout since previous data is still being used in videos
    const timeout = setTimeout(() => {
      if (isFetched && videos?.length === 0) {
        Alert.alert(
          "No listings found",
          "Try changing your filters or searching for something else.",
          [{ text: "OK", onPress: () => navigation.navigate(Routes.FILTER) }],
        );
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [isFetched, videos]);

  useEffect(() => {
    if (videoFilters !== null) {
      console.log("Filters changed. Refreshing...");
      videoFeedRef.current?.resetIndex();
      scrollToTop(false);
    }
  }, [videoFilters]);

  return (
    <>
      <View style={style.mainContainer}>
        <HeaderIconView right>
          <Pressable
            onPress={() => navigation.navigate(Routes.FILTER)}
            style={({ pressed }) => pressedOpacity(pressed)}
          >
            <Fontello
              name="search-regular"
              size={25}
              color="white"
              style={globalStyles.iconShadow}
            />
          </Pressable>
        </HeaderIconView>

        {floatingIconEnabled && (
          <FloatingIcon
            onPress={() => navigation.navigate(Routes.PACKAGES)}
            onClose={() => setFloatingIconEnabled(false)}
            containerStyle={style.floatingIcon}
          >
            <Deals width={100} height={100} />
          </FloatingIcon>
        )}

        <VideoFeed
          ref={videoFeedRef}
          videos={videos}
          onEndReached={() => !isFetching && fetchNextPage()}
          refreshControl={
            <RefreshControl
              tintColor="white"
              refreshing={isRefreshing}
              onRefresh={() => refresh()}
              style={{ ...(isRefreshing && { marginTop: insets.top + 10 }) }}
              progressViewOffset={insets.top}
            />
          }
          bottomTabHeight={bottomTabHeight}
        />
      </View>

      <DialogLoading
        visible={isFetching && !isFetchingNextPage && !isRefreshing}
        theme={dialogTheme}
      />
    </>
  );
};

export default Home;
