import { useQuery } from "@tanstack/react-query";
import { addMonths, differenceInDays, format, isAfter } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Alert, Text, View } from "react-native";
import { CalendarList } from "react-native-calendars/src/index";
import { useToast } from "react-native-toast-notifications";
import { Item } from "react-navigation-header-buttons";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import toastStyles from "../../assets/styles/toastStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppFooterDetails from "../../components/AppFooterDetails/AppFooterDetails";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import {
  useBookingContext,
  useBookingData,
} from "../../contexts/BookingContext";
import { useCartContext } from "../../contexts/CartContext";
import { useListingContext } from "../../contexts/ListingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { CALENDAR_THEME } from "../../data/RNCTheme";
import useDates, { RNC_DATE_FORMAT } from "../../hooks/useDates";
import { fetchListing } from "../../services/apiService";
import formatRange from "../../utils/rangeFormatter";

const SelectDates = ({ navigation, route }) => {
  const { screenToNavigate, ...otherParams } = route.params || {};

  const { room } = useRoomContext();
  const {
    listing: { id: listingId, is_entire_place: isEntirePlace, ...initialData },
  } = useListingContext();
  const { setBookingData } = useBookingContext();
  const { archiveAll } = useCartContext();
  const bookingData = useBookingData();
  const toast = useToast();

  const [startDate, setStartDate] = useState(`${bookingData.startDate}`);
  const [endDate, setEndDate] = useState(`${bookingData.endDate}`);
  const [current, setCurrent] = useState(format(new Date(), RNC_DATE_FORMAT));
  const [isLoading, setIsLoading] = useState(true);

  const { data: listing, isFetching } = useQuery({
    queryKey: ["listings", listingId, startDate, endDate],
    queryFn: () => fetchListing({ listingId, startDate, endDate }),
    enabled: Boolean(isEntirePlace && startDate && endDate),
    staleTime: 0,
    initialData,
  });

  const { maxDate, markedDates, onDayPress, clearDates } = useDates({
    startDate,
    endDate,
    onStartDateChange: setStartDate,
    onEndDateChange: setEndDate,
    unavailableDates: isEntirePlace
      ? listing?.unavailable_dates
      : room?.unavailable_dates,
    highlightedDates: bookingData.highlightedDates,
  });

  const headerRight = useCallback(() => {
    const isStateReset = !startDate && !endDate;
    return (
      <Item
        title="Clear"
        color={isStateReset ? "rgba(255,255,255,0.4)" : "white"}
        disabled={isStateReset}
        onPress={() => {
          clearDates();
          toast.show("Dates cleared", {
            type: "success",
            placement: "top",
            style: toastStyles.toastInsetHeader,
            duration: 800,
          });
        }}
      />
    );
  }, [startDate, endDate, clearDates, toast]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  // Hide all toasts on unmount
  useEffect(() => {
    return () => toast.hideAll();
  }, [toast]);

  const navigateNext = useCallback(() => {
    // Replace the current screen with the new screen
    navigation.pop();

    if (!screenToNavigate) {
      return;
    }

    navigation.navigate({
      name: screenToNavigate,
      params: otherParams,
      merge: true,
    });
  }, [navigation, screenToNavigate, otherParams]);

  const footerTitle = useMemo(() => {
    const price = room?.category.price || listing?.entire_place_price;

    if (!price) {
      return "";
    }

    if (startDate && endDate) {
      const diffInDays = differenceInDays(
        new Date(endDate),
        new Date(startDate),
      );
      const total = price * (diffInDays || 1);
      return `Total: ₱${total.toLocaleString()}`;
    }

    return `₱${price.toLocaleString()}/night`;
  }, [room?.category.price, listing?.entire_place_price, startDate, endDate]);

  const onConfirmDate = useCallback(() => {
    // Navigate to the next screen
    navigateNext();

    // Archive all items in the cart
    archiveAll({ listingId });

    // Update booking dates
    setBookingData({
      listingId,
      startDate,
      endDate,
    });
  }, [archiveAll, listingId, navigateNext, setBookingData, startDate, endDate]);

  const footerButtonOnPress = useCallback(() => {
    if (!startDate || !endDate) {
      toast.hideAll();
      toast.show("Please select a date range.", {
        type: "warning",
        placement: "top",
        style: toastStyles.toastInsetHeader,
        duration: 3000,
      });
      return;
    }

    if (
      bookingData.startDate === startDate &&
      bookingData.endDate === endDate
    ) {
      navigateNext();
      return;
    }

    Alert.alert("Confirm Date", "Are you sure you want to select this date?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: onConfirmDate,
      },
    ]);
  }, [
    bookingData.startDate,
    bookingData.endDate,
    startDate,
    endDate,
    navigateNext,
    onConfirmDate,
    toast,
  ]);

  return (
    <View style={globalStyles.flexFull}>
      <View style={globalStyles.flexFull}>
        <CalendarList
          current={current}
          theme={CALENDAR_THEME}
          // style={globalStyles.topGap}
          calendarStyle={{
            paddingTop: 5,
            borderBottomWidth: 3,
            borderBottomColor: Colors.lightgray,
          }}
          onLayout={() => {
            // Scroll to last selected date, after loading the CalendarList
            setCurrent(bookingData.startDate);

            // Will only delay if the start date is after a month from now
            // Delay is used to help with scrolling animation
            if (
              bookingData.startDate &&
              isAfter(new Date(bookingData.startDate), addMonths(new Date(), 1))
            ) {
              setTimeout(() => setIsLoading(false), 300);
            } else {
              setIsLoading(false);
            }
          }}
          minDate={format(new Date(), RNC_DATE_FORMAT)}
          maxDate={maxDate}
          pastScrollRange={0}
          futureScrollRange={12}
          onDayPress={onDayPress}
          markingType="period"
          markedDates={markedDates}
          animateScroll
        />
      </View>

      <AppFooter>
        <AppFooterDetails
          title={footerTitle}
          titleStyle={{ fontWeight: "500" }}
          buttonLinkVisible={false}
          buttonLabel="Set Date"
          buttonOnPress={footerButtonOnPress}
        >
          <Text>{startDate ? formatRange(startDate, endDate) : ""}</Text>
        </AppFooterDetails>
      </AppFooter>

      <DialogLoading visible={isLoading || isFetching} />
    </View>
  );
};

export default SelectDates;
