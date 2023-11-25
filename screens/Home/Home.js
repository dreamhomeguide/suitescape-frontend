import Entypo from "@expo/vector-icons/Entypo";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import style from "./HomeStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import HeaderIconView from "../../components/HeaderIconView/HeaderIconView";
import VideoFeed from "../../components/VideoFeed/VideoFeed";
import useFetchVideos from "../../hooks/useFetchVideos";
import { Routes } from "../../navigation/Routes";

const Home = ({ navigation }) => {
  const { videos, fetchNextPage, isRefreshing, refresh } = useFetchVideos();

  const bottomTabHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  return (
    <View style={style.mainContainer}>
      <HeaderIconView right>
        <Pressable
          onPress={() => navigation.navigate(Routes.SEARCH)}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <Entypo
            name="magnifying-glass"
            size={30}
            color="white"
            style={globalStyles.iconShadow}
          />
        </Pressable>
      </HeaderIconView>
      <VideoFeed
        videos={videos}
        onEndReached={() => fetchNextPage()}
        refreshControl={
          <RefreshControl
            tintColor="white"
            refreshing={isRefreshing}
            onRefresh={() => refresh()}
            progressViewOffset={insets.top}
          />
        }
        bottomTabHeight={bottomTabHeight}
      />
    </View>
  );
};

export default Home;
