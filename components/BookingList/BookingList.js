import React, { forwardRef, memo } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import splitTextSpaced from "../../utilities/textSplitSpacer";
import BookingItem from "../BookingItem/BookingItem";

const BookingList = forwardRef(
  ({ data, type, isFetched, isRefreshing, onRefresh }, ref) => {
    const insets = useSafeAreaInsets();

    return (
      <Tabs.FlatList
        ref={ref}
        data={data}
        contentInset={{ bottom: insets.bottom }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BookingItem item={item} type={type} />}
        initialNumToRender={5}
        windowSize={5}
        removeClippedSubviews
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
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
  },
);

export default memo(BookingList);
