import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import ButtonLarge from "../../components/ButtonLarge/ButtonLarge";
import ListingAvailableRoomItem from "../../components/ListingAvailableRoomItem/ListingAvailableRoomItem";
import { useBookingData } from "../../contexts/BookingContext";
import { useCartContext, useCartData } from "../../contexts/CartContext";
import { useTimerContext } from "../../contexts/TimerContext";
import { fetchListingRooms } from "../../services/apiService";

const AvailableRooms = ({ route }) => {
  const listingId = route.params.listingId;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { openCart, refreshAll } = useCartContext();
  const { resumeTimer } = useTimerContext();
  const bookingData = useBookingData();
  const cartData = useCartData();

  const cartSize = cartData.cart.length > 0 && `(${cartData.cart.length})`;

  const {
    data: rooms,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "listings",
      listingId,
      "rooms",
      bookingData.startDate,
      bookingData.endDate,
    ],
    queryFn: () =>
      fetchListingRooms({
        listingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      }),
  });

  // Update cart items with the new price
  useEffect(() => {
    if (rooms) {
      // Set the price of each room to the price of the category
      refreshAll({
        listingId,
        rooms: rooms.map((room) => ({ ...room, price: room.category.price })),
      });
      console.log("Room prices in cart updated");
    }
  }, [rooms]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log("Available rooms refetched");
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      console.log("Resuming timer...");
      resumeTimer(listingId);
    }, []),
  );

  const renderItem = useCallback(
    ({ item }) => <ListingAvailableRoomItem item={item} />,
    [],
  );

  return (
    <>
      <FlatList
        data={rooms}
        contentContainerStyle={globalStyles.rowGap}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={5}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() =>
          isFetching && <ActivityIndicator style={globalStyles.loadingCircle} />
        }
      />

      <AppFooter>
        <View style={globalStyles.buttonRow}>
          <View style={globalStyles.flexFull}>
            <ButtonLarge onPress={openCart}>View Cart {cartSize}</ButtonLarge>
          </View>
        </View>
      </AppFooter>
    </>
  );
};

export default AvailableRooms;
