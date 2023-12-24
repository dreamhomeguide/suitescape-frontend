import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import React, { useRef } from "react";
import { Pressable, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./HomeStyles";
import Fontello from "../../assets/fontello/Fontello";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import HeaderIconView from "../../components/HeaderIconView/HeaderIconView";
import VideoFeed from "../../components/VideoFeed/VideoFeed";
import useFetchVideos from "../../hooks/useFetchVideos";
import { Routes } from "../../navigation/Routes";

const Home = ({ navigation }) => {
  const { videos, isFetching, fetchNextPage, isRefreshing, refresh } =
    useFetchVideos();

  const bottomTabHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const videoFeedRef = useRef(null);

  // Allows the feed to scroll to top when the tab is pressed
  useScrollToTop(
    useRef({
      scrollToTop: () => {
        videoFeedRef.current?.scrollToOffset({ offset: 0 });
        // refetch().then(() => console.log("Videos refetched"));
      },
    }),
  );

  return (
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
  );
};

export default Home;
