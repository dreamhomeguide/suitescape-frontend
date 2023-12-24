import { useTheme } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect } from "react";
import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import ListingItem from "../../components/ListingItem/ListingItem";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import useFetchAPI from "../../hooks/useFetchAPI";
import { FontelloHeaderButton } from "../../navigation/HeaderButtons";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const ProfileHost = ({ navigation, route }) => {
  const hostId = route.params.hostId;

  const { data: host } = useFetchAPI(`/hosts/${hostId}`);

  // Destructure hostData
  const {
    listings,
    reviews,
    listings_count: listingsCount,
    listings_likes_count: likesCount,
    listings_reviews_count: reviewsCount,
    ...hostData
  } = host || {};

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={FontelloHeaderButton}>
          <Item
            title="menu"
            iconName="hamburger-regular"
            color={colors.text}
            onPress={() => console.log("Menu pressed")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

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
      <Tabs.Container
        lazy
        renderHeader={() => (
          <HeaderProfileHost
            hostName={hostData.fullname}
            userName={
              // Temporary username for host
              hostData.firstname + hostData.lastname
            }
            listingsCount={listingsCount}
            likesCount={likesCount}
            reviewsCount={reviewsCount}
          />
        )}
        renderTabBar={(props) => <TabBar defaultProps={props} />}
      >
        <Tabs.Tab name="Listings">
          <Tabs.FlatList
            data={listings}
            contentContainerStyle={{ paddingBottom: insets.bottom + 15 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListingItem}
            initialNumToRender={10}
            windowSize={5}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={30}
            removeClippedSubviews={false}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Reviews">
          <Tabs.FlatList
            data={reviews}
            contentContainerStyle={{ paddingBottom: insets.bottom + 15 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReviewItem}
            initialNumToRender={10}
            windowSize={5}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={30}
            removeClippedSubviews={false}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default ProfileHost;
