import { useScrollToTop } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RefreshControl } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

import { Colors } from "../../assets/Colors";
import BookingList from "../../components/BookingList/BookingList";
import FocusAwareStatusBar from "../../components/FocusAwareStatusBar/FocusAwareStatusBar";
import { useSettings } from "../../contexts/SettingsContext";
import { TabBar } from "../../navigation/TopTabs/TopTabs";
import {
  fetchHostBookings,
  fetchUserBookings,
} from "../../services/apiService";

const Bookings = ({ navigation, route }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabsRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const { settings } = useSettings();

  const {
    data: bookings,
    refetch,
    isFetched,
  } = useQuery({
    queryKey: ["bookings", settings.hostModeEnabled ? "host" : "user"],
    queryFn: settings.hostModeEnabled ? fetchHostBookings : fetchUserBookings,
    enabled: !settings.guestModeEnabled,
  });

  // Jump to tab and scroll to top after finishing booking
  useEffect(() => {
    if (route.params?.tab) {
      const tabToNavigate = route.params.tab;
      tabsRef.current?.jumpToTab(tabToNavigate);

      // Scroll to top after tab is changed
      scrollTimeoutRef.current = setTimeout(
        () => tabsRef.current?.jumpToTab(tabToNavigate),
        300,
      );

      // Refetch bookings
      // refetch().then(() => console.log("Bookings refetched"));

      // Reset tab params
      navigation.setParams({ tab: null });
    }
  }, [route.params?.tab]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Scroll to top whenever tab is pressed
  useScrollToTop(
    useRef({
      scrollToTop: () => {
        const currentIndex = tabsRef.current?.getCurrentIndex();
        tabsRef.current?.setIndex(currentIndex);
      },
    }),
  );

  // Memoize bookings
  const {
    upcomingBookings,
    ongoingBookings,
    completedBookings,
    toRateBookings,
    cancelledBookings,
  } = useMemo(() => {
    const upcomingBookings = bookings?.filter(
      (booking) => booking.status === "upcoming",
    );
    const ongoingBookings = bookings?.filter(
      (booking) => booking.status === "ongoing",
    );
    const completedBookings = bookings?.filter(
      (booking) => booking.status === "completed",
    );
    const toRateBookings = bookings?.filter(
      (booking) => booking.status === "to_rate",
    );
    const cancelledBookings = bookings?.filter(
      (booking) => booking.status === "cancelled",
    );
    return {
      upcomingBookings,
      ongoingBookings,
      completedBookings,
      toRateBookings,
      cancelledBookings,
    };
  }, [bookings]);

  const renderTabBar = useCallback(
    (props) => <TabBar defaultProps={props} fontSize={12} scrollEnabled />,
    [],
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log("Bookings refetched");
    } catch (err) {
      console.log(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const refreshControl = useMemo(() => {
    if (!settings.guestModeEnabled) {
      return <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />;
    }
    return null;
  }, [isRefreshing, onRefresh, settings.guestModeEnabled]);

  const bookingsFetched = (isFetched && bookings) || settings.guestModeEnabled;

  return (
    <>
      <FocusAwareStatusBar style="dark" animated />
      <Tabs.Container
        ref={tabsRef}
        renderTabBar={renderTabBar}
        containerStyle={{ backgroundColor: Colors.backgroundGray }}
        lazy
      >
        <Tabs.Tab name="Upcoming">
          <BookingList
            data={upcomingBookings}
            type="upcoming"
            isFetched={bookingsFetched}
            refreshControl={refreshControl}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Ongoing">
          <BookingList
            data={ongoingBookings}
            type="ongoing"
            isFetched={bookingsFetched}
            refreshControl={refreshControl}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Completed">
          <BookingList
            data={completedBookings}
            type="completed"
            isFetched={bookingsFetched}
            refreshControl={refreshControl}
          />
        </Tabs.Tab>
        <Tabs.Tab name="To Rate">
          <BookingList
            data={toRateBookings}
            type="to_rate"
            isFetched={bookingsFetched}
            refreshControl={refreshControl}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Cancelled">
          <BookingList
            data={cancelledBookings}
            type="cancelled"
            isFetched={bookingsFetched}
            refreshControl={refreshControl}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </>
  );
};

export default Bookings;
