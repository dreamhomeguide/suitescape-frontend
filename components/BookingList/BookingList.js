import React, { memo, useCallback } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import splitTextSpaced from "../../utilities/textSplitSpacer";
import BookingItem from "../BookingItem/BookingItem";

const BookingList = ({ data, type, isFetched, refreshControl }) => {
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(({ item }) => {
    return <BookingItem item={item} type={type} />;
  }, []);

  return (
    <Tabs.FlatList
      data={data}
      contentInset={{ bottom: insets.bottom }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      initialNumToRender={10}
      windowSize={10}
      refreshControl={refreshControl}
      ItemSeparatorComponent={() => <View style={globalStyles.bottomGap} />}
      ListEmptyComponent={() =>
        isFetched ? (
          <View style={globalStyles.flexCenter}>
            <Text style={globalStyles.emptyText}>
              No {splitTextSpaced(type)} bookings
            </Text>
          </View>
        ) : (
          <ActivityIndicator style={globalStyles.loadingCircle} />
        )
      }
    />
  );
};

export default memo(BookingList);
