import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";
import { format } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator } from "react-native";
import { CalendarList } from "react-native-calendars/src/index";
import { Item } from "react-navigation-header-buttons";

import globalStyles from "../../assets/styles/globalStyles";
import CalendarDateSheet from "../../components/CalendarDateSheet/CalendarDateSheet";
import CalendarHostDay from "../../components/CalendarHostDay/CalendarHostDay";
import DialogLoading from "../../components/DialogLoading/DialogLoading";
import { CALENDAR_HOST_THEME } from "../../data/RNCTheme";
import useCalendar from "../../hooks/useCalendar";
import useDates, { RNC_DATE_FORMAT } from "../../hooks/useDates";
import { Routes } from "../../navigation/Routes";

const CALENDAR_HEIGHT = (95 + 20) * 6; // From CalendarHostDay component (+20 additional) * weeks

const Calendar = ({ navigation, route }) => {
  const { id, type } = route.params || {};

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarListRef = useRef(null);

  const isFocused = useIsFocused();
  const { dataQuery, getCalendarPrice, getSpecialRate } = useCalendar();
  const { data, isFetched, isLoading } = dataQuery;
  const { markedDates, onMultipleDayPress, clearDates } = useDates({
    startDate,
    endDate,
    onStartDateChange: setStartDate,
    onEndDateChange: setEndDate,
    unavailableDates: data?.unavailable_dates,
  });

  useEffect(() => {
    // Scroll to the start date when it is selected
    if (startDate) {
      calendarListRef.current.scrollToDay(startDate, 0, true);
    }
  }, [startDate]);

  const currentDate = useMemo(() => format(new Date(), RNC_DATE_FORMAT), []);

  const DayComponent = useMemo(
    () =>
      ({ date, ...props }) => {
        return (
          <CalendarHostDay
            {...props}
            date={date}
            price={getCalendarPrice(date.dateString)}
            onDayPress={() => onMultipleDayPress(date)}
            isSpecialRate={!!getSpecialRate(date.dateString)}
          />
        );
      },
    [getCalendarPrice, getSpecialRate, onMultipleDayPress],
  );

  const headerRight = useCallback(() => {
    return (
      <Item
        title="Settings"
        onPress={() =>
          navigation.navigate(Routes.CALENDAR_SETTING, { id, type })
        }
        IconComponent={MaterialCommunityIcons}
        iconName="menu"
        color="white"
        iconSize={25}
      />
    );
  }, [id, navigation, type]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
      title: data?.name,
    });
  }, [headerRight, data?.name, navigation]);

  if (!showCalendar) {
    return (
      <ActivityIndicator
        size="small"
        style={globalStyles.loadingCircle}
        onLayout={() => setShowCalendar(true)}
      />
    );
  }

  return (
    <>
      {isFetched && (
        <CalendarList
          ref={calendarListRef}
          current={currentDate}
          theme={CALENDAR_HOST_THEME}
          dayComponent={DayComponent}
          markedDates={markedDates}
          calendarHeight={CALENDAR_HEIGHT}
          scrollsToTop
        />
      )}

      {isFocused && (
        <CalendarDateSheet
          startDate={startDate}
          endDate={endDate}
          onClose={() => clearDates()}
        />
      )}

      <DialogLoading visible={isLoading} />
    </>
  );
};

export default Calendar;
