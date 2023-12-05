import { useTheme } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import HeaderProfileHost from "../../components/HeaderProfileHost/HeaderProfileHost";
import OnboardingItem from "../../components/OnboardingItem/OnboardingItem";
import slideData from "../../data/slideData";
import { IoniconsHeaderButton } from "../../navigation/HeaderButtons";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const ProfileHost = ({ navigation, route }) => {
  const listingId = route.params.listingId;

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
        renderHeader={() => <HeaderProfileHost />}
        renderTabBar={(props) => <TabBar defaultProps={props} />}
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
