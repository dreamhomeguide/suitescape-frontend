import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, RefreshControl, View } from "react-native";

import style from "./HomeStyles";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import HeaderIcon from "../../components/HeaderIcon/HeaderIcon";
import IconBadge from "../../components/IconBadge/IconBadge";
import VideoFeed from "../../components/VideoFeed/VideoFeed";
import useFetchVideos from "../../hooks/useFetchVideos";

const Home = () => {
  const { videos, fetchNextPage, isRefreshing, refresh } = useFetchVideos();
  const bottomTabHeight = useBottomTabBarHeight();

  return (
    <View style={style.mainContainer}>
      <HeaderIcon>
        <Pressable
          onPress={() => console.log("Options")}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <Ionicons
            name="options"
            size={30}
            color="white"
            style={globalStyles.iconShadow}
          />
        </Pressable>
      </HeaderIcon>
      <HeaderIcon right>
        <Pressable
          onPress={() => console.log("Cart")}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <IconBadge count={0}>
            <FontAwesome5
              name="shopping-cart"
              size={22}
              color="white"
              style={globalStyles.iconShadow}
            />
          </IconBadge>
        </Pressable>

        {/*<NotificationBadge*/}
        {/*  size={0}*/}
        {/*  iconStyle={globalStyles.iconShadow}*/}
        {/*  onPress={() => console.log("Notifications")}*/}
        {/*/>*/}
      </HeaderIcon>
      <VideoFeed
        videos={videos}
        onEndReached={() => fetchNextPage()}
        refreshControl={
          <RefreshControl
            tintColor="white"
            refreshing={isRefreshing}
            onRefresh={() => refresh()}
          />
        }
        bottomTabHeight={bottomTabHeight}
      />
    </View>
  );
};

export default Home;
