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
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { CalendarList } from "react-native-calendars/src/index";
import { useToast } from "react-native-toast-notifications";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../../components/AppFooter/AppFooter";
import AppFooterDetails from "../../components/AppFooterDetails/AppFooterDetails";
import AppHeader from "../../components/AppHeader/AppHeader";
import LoadingDialog from "../../components/LoadingDialog/LoadingDialog";
import { useBookingContext } from "../../contexts/BookingContext";
import { useRoomContext } from "../../contexts/RoomContext";
import { Routes } from "../../navigation/Routes";

const sampleDisabledDays = [
  new Date("2023-11-30"),
  new Date("2023-12-01"),
  new Date("2023-12-05"),
  new Date("2023-12-20"),
];

const DATE_FORMAT = "yyyy-MM-dd";

const SelectDates = ({ navigation }) => {
  const { bookingState, setBookingData } = useBookingContext();

  const [startDate, setStartDate] = useState(bookingState.startDate ?? "");
  const [endDate, setEndDate] = useState(bookingState.endDate ?? "");
  const [current, setCurrent] = useState(format(new Date(), DATE_FORMAT));
  const [isLoading, setIsLoading] = useState(true);

  const { room } = useRoomContext();
  const toast = useToast();

  // Hide all toasts on unmount
  useEffect(() => {
    return () => toast.hideAll();
  }, []);

  const diffInDays = useMemo(() => {
    if (startDate && endDate) {
      return differenceInDays(new Date(endDate), new Date(startDate));
    }
    return 0;
  }, [startDate, endDate]);

  const disabledDates = useMemo(() => {
    const disabledDays = {};
    for (const day of sampleDisabledDays) {
      disabledDays[format(day, DATE_FORMAT)] = {
        disabled: true,
      };
    }
    return disabledDays;
  }, []);

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
        if (
          sampleDisabledDays
            .map((d) => format(d, DATE_FORMAT))
            .includes(format(day, DATE_FORMAT))
        ) {
          // Style disabled days
          markedDays[format(day, DATE_FORMAT)] = {
            selected: true,
            color: Colors.lightgray,
          };
          continue;
        }

        markedDays[format(day, DATE_FORMAT)] = {
          selected: true,
          color: Colors.red,
        };
      }
    }

    return {
      [endDate]: {
        selected: true,
        endingDay: true,
        color: Colors.darkred,
      },
      [startDate]: {
        selected: true,
        startingDay: true,
        endingDay: startDate === endDate,
        color: Colors.darkred,
      },
      ...disabledDates,
      ...markedDays,
    };
  }, [startDate, endDate]);

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const onDayPress = (date) => {
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
    if (date.dateString === startDate) {
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
      setEndDate(date.dateString);
      return;
    }

    // Reset dates and set new start date
    clearDates();
    setStartDate(date.dateString);

    toast.show("Select an end date", {
      placement: "top",
      style: {
        ...globalStyles.toast,
        ...globalStyles.toastTopHeader,
      },
      // textStyle: { padding: 5, fontSize: 16 },
    });
  };

  return (
    <View style={globalStyles.flexFull}>
      <AppHeader />
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
            ...globalStyles.bottomGap,
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
          animateScroll
          pastScrollRange={0}
          futureScrollRange={12}
          onDayPress={onDayPress}
          markingType="period"
          markedDates={markedDates}
          scrollsToTop
        />
      </View>

      <LoadingDialog visible={isLoading} />

      <AppFooter>
        <AppFooterDetails
          title={room?.category.price ? `₱${room.category.price}/night` : ""}
          buttonLinkVisible={false}
          buttonLabel="Set Date"
          buttonOnPress={() => {
            setBookingData({
              startDate,
              endDate: endDate ? endDate : startDate,
              nights: diffInDays,
            });
            navigation.navigate({ name: Routes.ROOM_DETAILS, merge: true });
          }}
        />
      </AppFooter>
    </View>
  );
};

export default SelectDates;
