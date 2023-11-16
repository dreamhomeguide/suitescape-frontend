import React from "react";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OnboardingItem from "../../components/OnboardingItem/OnboardingItem";
import slideData from "../../data/slideData";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const Bookings = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs.Container
      renderTabBar={(props) => <TabBar {...props} fontSize={12} />}
    >
      <Tabs.Tab name="Ongoing">
        <Tabs.FlatList
          data={slideData}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <OnboardingItem {...item} />}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed">
        <Tabs.FlatList
          data={slideData}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <OnboardingItem {...item} />}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Rating">
        <Tabs.FlatList
          data={slideData}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <OnboardingItem {...item} />}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Cancelled">
        <Tabs.FlatList
          data={slideData}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <OnboardingItem {...item} />}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default Bookings;
