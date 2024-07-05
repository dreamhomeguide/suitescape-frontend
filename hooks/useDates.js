import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  subDays,
} from "date-fns";
import { useCallback, useMemo } from "react";
import { useToast } from "react-native-toast-notifications";

import { Colors } from "../assets/Colors";
import toastStyles from "../assets/styles/toastStyles";

export const RNC_DATE_FORMAT = "yyyy-MM-dd";

const useDates = ({
  startDate = "",
  endDate = "",
  onStartDateChange: setStartDate,
  onEndDateChange: setEndDate,
  unavailableDates = null,
  highlightedDates = null,
}) => {
  const toast = useToast();

  const maxDate = useMemo(() => {
    if (!startDate || !unavailableDates) {
      return "";
    }

    // Sort the unavailable_dates array in ascending order
    const sortedUnavailableDates = unavailableDates.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // Find the earliest date after the start date
    const earliestDisabledDate = sortedUnavailableDates.find(
      (unavailableDate) =>
        isAfter(new Date(unavailableDate.date), new Date(startDate)),
    );

    if (!earliestDisabledDate) {
      return "";
    }

    // Return the day before the start date of the disabled date
    return format(subDays(earliestDisabledDate.date, 1), RNC_DATE_FORMAT);
  }, [startDate, unavailableDates]);

  const disabledDates = useMemo(() => {
    if (!unavailableDates) {
      return {};
    }

    const disabledDays = {};
    for (const unavailableDate of unavailableDates) {
      const formattedDate = format(unavailableDate.date, RNC_DATE_FORMAT);

      disabledDays[formattedDate] = {
        disabled: true,
        disableTouchEvent: true,
        type: unavailableDate.type,
      };
    }
    return disabledDays;
  }, [unavailableDates]);

  const additionalMarkedDates = useMemo(() => {
    if (!highlightedDates) {
      return {};
    }

    const highlightedDays = {};
    for (const day of highlightedDates) {
      const formattedDate = format(new Date(day), RNC_DATE_FORMAT);

      highlightedDays[formattedDate] = {
        marked: true,
        dotColor: Colors.red,
      };
    }
    return highlightedDays;
  }, [highlightedDates]);

  const markedDates = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const finalMarkedDates = {};

    // Incorporate disabled dates
    Object.entries(disabledDates).forEach(([date, calendarProps]) => {
      finalMarkedDates[date] = { ...finalMarkedDates[date], ...calendarProps };
    });

    // Incorporate additional marked dates
    Object.entries(additionalMarkedDates).forEach(([date, calendarProps]) => {
      finalMarkedDates[date] = { ...finalMarkedDates[date], ...calendarProps };
    });

    if (
      startDate &&
      endDate &&
      isBefore(start, end) &&
      differenceInDays(end, start) > 1
    ) {
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

        const formattedDay = format(day, RNC_DATE_FORMAT);
        finalMarkedDates[formattedDay] = {
          ...finalMarkedDates[formattedDay], // Merge with existing properties if any
          selected: true,
          textColor: "black",
          color: Colors.lightblue,
        };
      }
    }

    // Setting specific styles for start and end dates
    finalMarkedDates[startDate] = {
      ...finalMarkedDates[startDate],
      selected: true,
      startingDay: true,
      endingDay: startDate === endDate,
      color: Colors.blue,
    };

    finalMarkedDates[endDate] = {
      ...finalMarkedDates[endDate],
      selected: true,
      endingDay: true,
      color: Colors.blue,
    };

    return finalMarkedDates;

    // return {
    //   ...disabledDates,
    //   ...additionalMarkedDates,
    //   ...markedDays,
    //   [endDate]: {
    //     selected: true,
    //     endingDay: true,
    //     color: Colors.blue,
    //   },
    //   [startDate]: {
    //     selected: true,
    //     startingDay: true,
    //     endingDay: startDate === endDate,
    //     color: Colors.blue,
    //   },
    // };
  }, [startDate, endDate, disabledDates, additionalMarkedDates]);

  const onMultipleDayPress = useCallback(
    (date) => {
      let startDate = null;
      let endDate = null;

      // Use setAction to get the previous state (improves performance)
      setStartDate((prevStartDate) => {
        startDate = prevStartDate;
        return prevStartDate;
      });
      setEndDate((prevEndDate) => {
        endDate = prevEndDate;
        return prevEndDate;
      });

      // If selected is also the start date, clear dates
      if (date.dateString === startDate && !endDate) {
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

      // Set start date
      setStartDate(date.dateString);
      setEndDate("");
    },
    [toast],
  );

  const onDayPress = useCallback(
    (date) => {
      let startDate = null;
      let endDate = null;

      // Use setAction to get the previous state (improves performance)
      setStartDate((prevStartDate) => {
        startDate = prevStartDate;
        return prevStartDate;
      });
      setEndDate((prevEndDate) => {
        endDate = prevEndDate;
        return prevEndDate;
      });

      // Hide all toasts
      toast.hideAll();

      // REMOVED: All markedDates reference for performance
      // If selected is disabled, do nothing
      // if (markedDates[date.dateString]?.disabled) {
      //   return;
      // }

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
      // if (markedDates[date.dateString]?.selected) {
      //   clearDates();
      //   return;
      // }

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
      });

      // Reset dates and set new start date
      setStartDate(date.dateString);
      setEndDate("");
    },
    [toast],
  );

  const clearDates = useCallback(() => {
    setStartDate("");
    setEndDate("");
  }, []);

  return {
    startDate,
    endDate,
    maxDate,
    markedDates,
    onDayPress,
    onMultipleDayPress,
    clearDates,
  };
};

export default useDates;
