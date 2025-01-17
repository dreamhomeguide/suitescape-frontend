import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Item } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import ListingItem from "../../components/ListingItem/ListingItem";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import { useAuth } from "../../contexts/AuthContext";
import { Routes } from "../../navigation/Routes";
import { TabBar } from "../../navigation/TopTabs/TopTabs";
import { fetchHost } from "../../services/apiService";

const ProfileHost = ({ navigation, route }) => {
  const [showList, setShowList] = useState(false);

  const {
    authState: { userId },
  } = useAuth();
  const insets = useSafeAreaInsets();

  const headerHeight = 400;
  const hostId = route.params.hostId;

  const { data: host, isFetched } = useQuery({
    queryKey: ["hosts", hostId],
    queryFn: () => fetchHost(hostId),
  });

  // Destructure hostData
  const {
    listings,
    reviews,
    listings_count: listingsCount,
    listings_likes_count: likesCount,
    listings_reviews_count: reviewsCount,
    listings_avg_rating: listingsAvgRating,
    ...hostData
  } = host || {};

  useEffect(() => {
    return navigation.addListener("transitionEnd", () => {
      setShowList(true);
    });
  }, [navigation]);

  const renderHeader = useCallback(
    () => (
      <HeaderProfileHost
        height={headerHeight}
        hostName={hostData.fullname}
        hostProfileUrl={hostData.profile_image_url}
        hostCoverUrl={hostData.cover_image_url}
        listingsAvgRating={listingsAvgRating}
        listingsCount={listingsCount}
        likesCount={likesCount}
        reviewsCount={reviewsCount}
      />
    ),
    [hostData, listingsAvgRating, listingsCount, likesCount, reviewsCount],
  );

  const renderTabBar = useCallback(
    (props) => <TabBar defaultProps={props} />,
    [],
  );

  const renderListingItem = useCallback(
    ({ item }) => <ListingItem item={item} />,
    [],
  );

  const renderReviewItem = useCallback(
    ({ item }) => <ReviewItem item={item} />,
    [],
  );

  const onChatHost = useCallback(() => {
    navigation.navigate(Routes.CHAT, { id: hostId });
  }, [navigation, hostId]);

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Chat"
        onPress={onChatHost}
        IconComponent={Ionicons}
        iconName="chatbox-ellipses-outline"
        color="white"
        iconSize={25}
      />
    );
  }, [onChatHost]);

  useLayoutEffect(() => {
    // Only show chat button if the user is not the host
    if (hostId !== userId) {
      navigation.setOptions({
        headerRight,
      });
    }
  }, [headerRight, hostId, navigation, userId]);

  return (
    <View style={globalStyles.flexFull}>
      <StatusBar style="light" />
      <Tabs.Container
        lazy
        renderHeader={renderHeader}
        renderTabBar={renderTabBar}
      >
        <Tabs.Tab name="Listings">
          {showList && (
            <Tabs.FlatList
              data={listings}
              contentContainerStyle={{
                paddingBottom: insets.bottom + 15,
                ...globalStyles.rowGap,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderListingItem}
              initialNumToRender={5}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={listings?.length > 0}
              ListEmptyComponent={
                isFetched ? (
                  <Text style={globalStyles.emptyTextCenter}>
                    No listings yet.
                  </Text>
                ) : (
                  <ActivityIndicator style={globalStyles.loadingCircle} />
                )
              }
            />
          )}
        </Tabs.Tab>
        <Tabs.Tab name="Reviews">
          {showList && (
            <Tabs.FlatList
              data={reviews}
              contentContainerStyle={{
                paddingBottom: insets.bottom + 15,
                ...globalStyles.rowGap,
              }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderReviewItem}
              initialNumToRender={5}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={reviews?.length > 0}
              ListEmptyComponent={
                isFetched ? (
                  <Text style={globalStyles.emptyTextCenter}>
                    No reviews yet.
                  </Text>
                ) : (
                  <ActivityIndicator style={globalStyles.loadingCircle} />
                )
              }
            />
          )}
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default ProfileHost;
