import { Colors } from "../assets/Colors";

export const CALENDAR_THEME = {
  dayTextColor: "black",
  monthTextColor: "black",
  textMonthFontSize: 20,
  textMonthFontWeight: "bold",
  textDayFontWeight: "400",
  textSectionTitleColor: "black",
  todayTextColor: Colors.blue,
};

export const CALENDAR_HOST_THEME = {
  ...CALENDAR_THEME,
  weekVerticalMargin: 0,
};
