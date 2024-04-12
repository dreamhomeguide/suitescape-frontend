import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import ListingAvailableRoomItem from "../../components/ListingAvailableRoomItem/ListingAvailableRoomItem";
import { useBookingContext } from "../../contexts/BookingContext";
import { fetchListingRooms } from "../../services/apiService";

const AvailableRooms = ({ route }) => {
  const listingId = route.params.listingId;

  const insets = useSafeAreaInsets();

  const { bookingState } = useBookingContext();

  const { data: rooms, isFetching } = useQuery({
    queryKey: ["listings", listingId, "rooms"],
    queryFn: () =>
      fetchListingRooms(
        listingId,
        bookingState.startDate,
        bookingState.endDate,
      ),
  });

  const renderItem = useCallback(
    ({ item }) => <ListingAvailableRoomItem item={item} />,
    [],
  );

  return (
    <FlatList
      data={rooms}
      contentInset={{ bottom: insets.bottom }}
      contentContainerStyle={globalStyles.rowGap}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      initialNumToRender={5}
      windowSize={5}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      removeClippedSubviews
      ListEmptyComponent={() =>
        isFetching && <ActivityIndicator style={globalStyles.loadingCircle} />
      }
    />
  );
};

export default AvailableRooms;
