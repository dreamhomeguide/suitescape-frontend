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

  const EmptyListComponent = useCallback(() => {
    return isFetched ? (
      <View
        style={{
          ...globalStyles.flexCenter,
          marginTop: 20,
        }}
      >
        <Text style={globalStyles.emptyText}>
          No {splitTextSpaced(type)} bookings
        </Text>
      </View>
    ) : (
      <ActivityIndicator style={globalStyles.loadingCircle} />
    );
  }, [isFetched]);

  return (
    <Tabs.FlatList
      data={data}
      contentInset={{ bottom: insets.bottom }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      initialNumToRender={5}
      windowSize={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={30}
      removeClippedSubviews
      refreshControl={refreshControl}
      ItemSeparatorComponent={() => <View style={globalStyles.bottomGap} />}
      ListEmptyComponent={EmptyListComponent}
    />
  );
};

export default memo(BookingList);
