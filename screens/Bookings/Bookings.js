import { useScrollToTop } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RefreshControl } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

import BookingList from "../../components/BookingList/BookingList";
import { useSettings } from "../../contexts/SettingsContext";
import useFetchAPI from "../../hooks/useFetchAPI";
import { TabBar } from "../../navigation/TopTabs/TopTabs";

const Bookings = ({ navigation, route }) => {
  const { settings } = useSettings();
  const {
    data: bookings,
    refetch,
    isFetched,
  } = useFetchAPI("/bookings", undefined, undefined, {
    enabled: !settings.guestModeEnabled,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabsRef = useRef(null);

  // Jump to tab and scroll to top after finishing booking
  useEffect(() => {
    if (route.params?.tab) {
      const tabToNavigate = route.params.tab;
      tabsRef.current?.jumpToTab(tabToNavigate);

      // Refetch bookings
      // refetch().then(() => console.log("Bookings refetched"));

      // Reset tab params
      navigation.setParams({ tab: null });
    }
  }, [route.params?.tab]);

  // Scroll to top whenever tab is pressed
  useScrollToTop(
    useRef({
      scrollToTop: () => {
        const currentIndex = tabsRef.current?.getCurrentIndex();
        tabsRef.current?.setIndex(currentIndex);
      },
    }),
  );

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

  const refreshControl = (
    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
  );

  const bookingsFetched = isFetched || settings.guestModeEnabled;

  return (
    <Tabs.Container
      ref={tabsRef}
      lazy
      renderTabBar={(props) => (
        <TabBar defaultProps={props} fontSize={12} scrollEnabled />
      )}
    >
      <Tabs.Tab name="Upcoming">
        <BookingList
          data={upcomingBookings}
          type="upcoming"
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
      <Tabs.Tab name="Rating">
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
  );
};

export default Bookings;
