import React from "react";
import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import AppHeader from "../../components/AppHeader/AppHeader";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import OnboardingItem from "../../components/OnboardingItem/OnboardingItem";
import slideData from "../../data/slideData";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const ProfileHost = ({ route }) => {
  const listingId = route.params.listingId;

  const insets = useSafeAreaInsets();

  return (
    <View style={globalStyles.flexFull}>
      <AppHeader menuEnabled />
      <Tabs.Container
        renderHeader={() => <HeaderProfileHost />}
        renderTabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Tab name="Listings">
          <Tabs.FlatList
            data={slideData}
            contentInset={{ bottom: insets.bottom }}
            renderItem={({ item }) => <OnboardingItem {...item} />}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Posts">
          <Tabs.FlatList
            data={slideData}
            contentInset={{ bottom: insets.bottom }}
            renderItem={({ item }) => <OnboardingItem {...item} />}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Reviews">
          <Tabs.FlatList
            data={slideData}
            contentInset={{ bottom: insets.bottom }}
            renderItem={({ item }) => <OnboardingItem {...item} />}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

export default ProfileHost;
