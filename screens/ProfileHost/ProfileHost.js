import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import ListingItem from "../../components/ListingItem/ListingItem";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import { TabBar } from "../../navigation/TopTabs/TopTabs";
import { fetchHost } from "../../services/apiService";

const ProfileHost = ({ navigation, route }) => {
  const [showList, setShowList] = useState(false);

  const insets = useSafeAreaInsets();

  const headerHeight = 380;
  const hostId = route.params.hostId;

  const { data: host } = useQuery({
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
        hostPictureUrl={hostData.picture_url}
        userName={
          // Temporary username for host
          hostData.firstname + hostData.lastname
        }
        listingsCount={listingsCount}
        likesCount={likesCount}
        reviewsCount={reviewsCount}
      />
    ),
    [hostData, listingsCount, likesCount, reviewsCount],
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
            />
          )}
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default ProfileHost;
