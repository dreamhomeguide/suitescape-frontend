import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import globalStyles from "../../assets/styles/globalStyles";
import BookingItem from "../../components/BookingItem/BookingItem";
import useFetchAPI from "../../hooks/useFetchAPI";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const Bookings = () => {
  const { data: bookings, isFetchedAfterMount } = useFetchAPI("/bookings");
  const insets = useSafeAreaInsets();

  const upcomingBookings = useMemo(
    () => bookings?.filter((booking) => booking.status === "upcoming"),
    [bookings],
  );

  const completedBookings = useMemo(
    () => bookings?.filter((booking) => booking.status === "completed"),
    [bookings],
  );

  const toRateBookings = useMemo(
    () =>
      bookings?.filter(
        (booking) => booking.status === "completed" && !booking.rating,
      ),
    [bookings],
  );

  const cancelledBookings = useMemo(
    () => bookings?.filter((booking) => booking.status === "cancelled"),
    [bookings],
  );

  return (
    <Tabs.Container
      renderTabBar={(props) => <TabBar {...props} fontSize={12} />}
    >
      <Tabs.Tab name="Upcoming">
        <Tabs.FlatList
          data={upcomingBookings}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <BookingItem item={item} type="upcoming" />}
          ListEmptyComponent={() =>
            isFetchedAfterMount && (
              <View style={globalStyles.flexCenter}>
                <Text style={{ margin: 15 }}>No upcoming bookings</Text>
              </View>
            )
          }
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed">
        <Tabs.FlatList
          data={completedBookings}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => (
            <BookingItem item={item} type="completed" />
          )}
          ListEmptyComponent={() =>
            isFetchedAfterMount && (
              <View style={globalStyles.flexCenter}>
                <Text style={globalStyles.emptyText}>
                  No completed bookings
                </Text>
              </View>
            )
          }
        />
      </Tabs.Tab>
      <Tabs.Tab name="Rating">
        <Tabs.FlatList
          data={toRateBookings}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <BookingItem item={item} type="rating" />}
          ListEmptyComponent={() =>
            isFetchedAfterMount && (
              <View style={globalStyles.flexCenter}>
                <Text style={globalStyles.emptyText}>No bookings to rate</Text>
              </View>
            )
          }
        />
      </Tabs.Tab>
      <Tabs.Tab name="Cancelled">
        <Tabs.FlatList
          data={cancelledBookings}
          contentInset={{ bottom: insets.bottom }}
          renderItem={({ item }) => <BookingItem item={item} />}
          ListEmptyComponent={() =>
            isFetchedAfterMount && (
              <View style={globalStyles.flexCenter}>
                <Text style={globalStyles.emptyText}>
                  No cancelled bookings
                </Text>
              </View>
            )
          }
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default Bookings;
