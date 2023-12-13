import { useTheme } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import ListingItem from "../../components/ListingItem/ListingItem";
import useFetchAPI from "../../hooks/useFetchAPI";
import { IoniconsHeaderButton } from "../../navigation/HeaderButtons";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const ProfileHost = ({ navigation, route }) => {
  const listingId = route.params.listingId;

  const { data: host } = useFetchAPI(`/listings/${listingId}/host`);

  // Destructure hostData
  const {
    listings,
    all_reviews: allReviews,
    listings_count: listingsCount,
    total_likes_count: totalLikesCount,
    total_reviews_count: totalReviewsCount,
    ...hostData
  } = host || {};

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="menu"
            iconName="menu"
            color={colors.text}
            onPress={() => console.log("menu")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return (
    <View style={globalStyles.flexFull}>
      <Tabs.Container
        renderHeader={() => (
          <HeaderProfileHost
            hostName={hostData.fullname}
            userName={
              // Temporary username for host
              "@" + (host ? hostData.firstname + hostData.lastname : "")
            }
            listingsCount={listingsCount}
            likesCount={totalLikesCount}
            reviewsCount={totalReviewsCount}
          />
        )}
        renderTabBar={(props) => <TabBar defaultProps={props} />}
      >
        <Tabs.Tab name="Listings">
          <Tabs.FlatList
            data={listings}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ListingItem item={item} />}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Reviews">
          <Tabs.FlatList
            data={allReviews}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  marginTop: 15,
                  margin: 10,
                  padding: 10,
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <Text>{item.content}</Text>
              </View>
            )}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default ProfileHost;
