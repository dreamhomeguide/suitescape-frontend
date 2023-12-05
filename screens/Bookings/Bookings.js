import { useScrollToTop } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "react-native-collapsible-tab-view";

import BookingList from "../../components/BookingList/BookingList";
import useFetchAPI from "../../hooks/useFetchAPI";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const Bookings = ({ navigation, route }) => {
  const {
    data: bookings,
    refetch,
    isFetchedAfterMount,
  } = useFetchAPI("/bookings");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabsRef = useRef(null);
  const upcomingRef = useRef(null);
  const completedRef = useRef(null);
  const ratingRef = useRef(null);
  const cancelledRef = useRef(null);

  useScrollToTop(upcomingRef);
  useScrollToTop(completedRef);
  useScrollToTop(ratingRef);
  useScrollToTop(cancelledRef);

  // Jump to tab and scroll to top
  useEffect(() => {
    if (route.params?.tab) {
      const tabToNavigate = route.params.tab;
      tabsRef.current?.jumpToTab(tabToNavigate);

      refetch().then(() => console.log("Bookings refetched"));

      // Reset tab params
      navigation.setParams({ tab: null });
    }
  }, [route.params?.tab]);

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

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
      console.log("Bookings refetched");
    }
  };

  return (
    <Tabs.Container
      ref={tabsRef}
      renderTabBar={(props) => (
        <TabBar defaultProps={props} fontSize={12} scrollEnabled />
      )}
    >
      <Tabs.Tab name="Upcoming">
        <BookingList
          ref={upcomingRef}
          data={upcomingBookings}
          type="upcoming"
          isFetched={isFetchedAfterMount}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Completed">
        <BookingList
          ref={completedRef}
          data={completedBookings}
          type="completed"
          isFetched={isFetchedAfterMount}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Rating">
        <BookingList
          ref={ratingRef}
          data={toRateBookings}
          type="to_rate"
          isFetched={isFetchedAfterMount}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Cancelled">
        <BookingList
          ref={cancelledRef}
          data={cancelledBookings}
          type="cancelled"
          isFetched={isFetchedAfterMount}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

export default Bookings;
