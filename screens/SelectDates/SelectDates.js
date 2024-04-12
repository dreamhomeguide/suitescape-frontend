import {
  addDays,
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  subDays,
} from "date-fns";
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
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import formatRange from "../../utils/rangeFormatter";

export const RNC_DATE_FORMAT = "yyyy-MM-dd";

const SelectDates = ({ navigation, route }) => {
  const { bookingState, setBookingData } = useBookingContext();
  const { room } = useRoomContext();
  const toast = useToast();

  const [startDate, setStartDate] = useState(bookingState.startDate || "");
  const [endDate, setEndDate] = useState(bookingState.endDate || "");
  const [current, setCurrent] = useState(format(new Date(), RNC_DATE_FORMAT));
  const [isLoading, setIsLoading] = useState(true);

  const { screenToNavigate, ...otherParams } = route.params || {};

  const clearDates = useCallback(() => {
    setStartDate("");
    setEndDate("");
  }, []);

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

  // Get night difference
  const diffInDays = useMemo(() => {
    if (startDate && endDate) {
      return differenceInDays(new Date(endDate), new Date(startDate));
    }
    return 0;
  }, [startDate, endDate]);

  const maxDate = useMemo(() => {
    if (!startDate) {
      return;
    }

    // Get the first disabled date after the start date
    const maxDate = bookingState.disabledDates.find((day) =>
      isAfter(day, new Date(startDate)),
    );

    if (maxDate) {
      return format(maxDate, RNC_DATE_FORMAT);
    }
  }, [bookingState.disabledDates, startDate]);

  const disabledDates = useMemo(() => {
    const disabledDays = {};
    for (const day of bookingState.disabledDates) {
      const formattedDate = format(new Date(day), RNC_DATE_FORMAT);

      disabledDays[formattedDate] = {
        disabled: true,
      };
    }
    return disabledDays;
  }, [bookingState.disabledDates]);

  const highlightedDates = useMemo(() => {
    const highlightedDays = {};
    for (const day of bookingState.highlightedDates) {
      const formattedDate = format(new Date(day), RNC_DATE_FORMAT);

      highlightedDays[formattedDate] = {
        marked: true,
        dotColor: Colors.red,
      };
    }
    return highlightedDays;
  }, [bookingState.highlightedDates]);

  const markedDates = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const markedDays = {};
    if (startDate && endDate && isBefore(start, end) && diffInDays > 1) {
      const exclusiveStart = addDays(start, 1);
      const exclusiveEnd = subDays(end, 1);
      const daysRange = eachDayOfInterval({
        start: exclusiveStart,
        end: exclusiveEnd,
      });

      for (const day of daysRange) {
        // if (
        //   sampleDisabledDays
        //     .map((d) => format(d, DATE_FORMAT))
        //     .includes(format(day, DATE_FORMAT))
        // ) {
        //   // Style disabled days
        //   markedDays[format(day, DATE_FORMAT)] = {
        //     selected: true,
        //     color: Colors.lightgray,
        //   };
        //   continue;
        // }

        markedDays[format(day, RNC_DATE_FORMAT)] = {
          selected: true,
          textColor: "black",
          color: Colors.lightblue,
        };
      }
    }

    return {
      ...disabledDates,
      ...highlightedDates,
      ...markedDays,
      [endDate]: {
        selected: true,
        endingDay: true,
        color: Colors.blue,
      },
      [startDate]: {
        selected: true,
        startingDay: true,
        endingDay: startDate === endDate,
        color: Colors.blue,
      },
    };
  }, [diffInDays, disabledDates, highlightedDates, startDate, endDate]);

  const onDayPress = useCallback(
    (date) => {
      // Hide all toasts
      toast.hideAll();

      // If selected is disabled, do nothing
      if (markedDates[date.dateString]?.disabled) {
        return;
      }

      // If selected is a formed circle, reset dates
      if (date.dateString === startDate && date.dateString === endDate) {
        clearDates();
        return;
      }

      // If selected is also the start date, make it the end date as well, forming a circle
      if (date.dateString === startDate && !endDate) {
        setEndDate(date.dateString);
        return;
      }

      // If selected is in marked dates, reset dates
      if (markedDates[date.dateString]?.selected) {
        clearDates();
        return;
      }

      // If there is a start date and no end date, set end date
      // Checks if the date is also after the start date
      if (
        startDate &&
        !endDate &&
        isAfter(new Date(date.dateString), new Date(startDate))
      ) {
        // Check if the end date passes through a disabled day
        // for (const day of sampleDisabledDays) {
        //   if (
        //     isWithinInterval(day, {
        //       start: new Date(startDate),
        //       end: new Date(date.dateString),
        //     })
        //   ) {
        //     // Set end date to the day before the disabled day
        //     const dayBeforeDisabled = subDays(day, 1);
        //     setEndDate(format(dayBeforeDisabled, DATE_FORMAT));
        //     toast.show(
        //       "Your selected range includes a date that is not available.",
        //       {
        //         type: "warning",
        //         placement: "top",
        //         style: toastStyles.toastInsetHeader,
        //         duration: 3000,
        //       },
        //     );
        //     return;
        //   }
        // }

        setEndDate(date.dateString);
        return;
      }

      toast.show("Select an end date", {
        placement: "top",
        style: toastStyles.toastInsetHeader,
        // textStyle: { padding: 5, fontSize: 16 },
      });

      // Reset dates and set new start date
      clearDates();
      setStartDate(date.dateString);
    },
    [startDate, endDate, markedDates, clearDates, toast],
  );

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
    if (!room?.category.price) {
      return "";
    }
    if (startDate && endDate) {
      const total = room?.category.price * (diffInDays || 1);
      return `Total: ₱${total.toLocaleString()}`;
    }
    return `₱${room.category.price.toLocaleString()}/night`;
  }, [diffInDays, room?.category.price]);

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
      bookingState.startDate === startDate &&
      bookingState.endDate === endDate
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
        onPress: () => {
          setBookingData({
            startDate,
            endDate,
          });
          navigateNext();
        },
      },
    ]);
  }, [
    bookingState.startDate,
    bookingState.endDate,
    startDate,
    endDate,
    navigateNext,
    setBookingData,
    toast,
  ]);

  return (
    <View style={globalStyles.flexFull}>
      <View style={globalStyles.flexFull}>
        <CalendarList
          current={current}
          theme={{
            dayTextColor: "black",
            monthTextColor: "black",
            textMonthFontSize: 20,
            textMonthFontWeight: "bold",
            textDayFontWeight: "400",
            textSectionTitleColor: "black",
            todayTextColor: Colors.blue,
          }}
          // style={globalStyles.topGap}
          calendarStyle={{
            paddingTop: 5,
            borderBottomWidth: 3,
            borderBottomColor: Colors.lightgray,
          }}
          onLayout={() => {
            // Scroll to last selected date, after loading the CalendarList
            setCurrent(bookingState.startDate);

            // Will only delay if the start date is after a month from now
            // Delay is used to help with scrolling animation
            if (
              bookingState.startDate &&
              isAfter(
                new Date(bookingState.startDate),
                addMonths(new Date(), 1),
              )
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
          scrollsToTop
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

      <DialogLoading visible={isLoading} />
    </View>
  );
};

export default SelectDates;
