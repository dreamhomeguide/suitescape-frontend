import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HiddenItem, OverflowMenu } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import OnboardingItem from "../../components/OnboardingItem/OnboardingItem";
import slideData from "../../data/slideData";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const ProfileHost = ({ navigation, route }) => {
  const listingId = route.params.listingId;

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <OverflowMenu
          OverflowIcon={() => (
            <Ionicons name="menu" color={colors.text} size={25} />
          )}
        >
          <HiddenItem title="Example" onPress={() => console.log("Example")} />
        </OverflowMenu>
      ),
    });
  }, [navigation]);

  return (
    <View style={globalStyles.flexFull}>
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
