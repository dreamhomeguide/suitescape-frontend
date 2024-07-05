import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList } from "react-native";

import style from "./CalendarRoomsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import CalendarRoomItem from "../../components/CalendarRoomItem/CalendarRoomItem";
import { useListingContext } from "../../contexts/ListingContext";
import { fetchListingRooms } from "../../services/apiService";

const CalendarRooms = ({ route }) => {
  const listingId = route.params.listingId;

  const { setListing } = useListingContext();

  const { data: rooms, isFetching } = useQuery({
    queryKey: ["listings", listingId, "rooms"],
    queryFn: () => fetchListingRooms({ listingId }),
  });

  const renderItem = useCallback(
    ({ item }) => <CalendarRoomItem item={item} />,
    [],
  );

  // Clear the listing context when the component unmounts
  useEffect(() => {
    return () => {
      setListing(null);
    };
  }, []);

  return (
    <FlatList
      data={rooms}
      contentContainerStyle={style.contentContainer}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={() =>
        isFetching && <ActivityIndicator style={globalStyles.loadingCircle} />
      }
    />
  );
};

export default CalendarRooms;
