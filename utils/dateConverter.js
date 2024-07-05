import { format, parse } from "date-fns";

const DATE_FORMAT = "MM/dd/yyyy";
const DATE_RESULT_FORMAT = "yyyy-MM-dd";

const TIME_FORMAT = "HH:mm:ss";
const TIME_RESULT_FORMAT = "h:mm a";

const DATE_TIME_FORMAT = "MM/dd/yyyy HH:mm:ss";
const DATE_TIME_RESULT_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const FORMAT_STRING = {
  date: DATE_FORMAT,
  time: TIME_FORMAT,
  datetime: DATE_TIME_FORMAT,
};

export const RESULT_STRING = {
  date: DATE_RESULT_FORMAT,
  time: TIME_RESULT_FORMAT,
  datetime: DATE_TIME_RESULT_FORMAT,
};

const convertDateFormat = (dateString, type = "date", formatStr, resultStr) => {
  const formatString = formatStr || FORMAT_STRING[type];
  const resultString = resultStr || RESULT_STRING[type];

  const parsedDate = parse(dateString, formatString, new Date());

  // If the date is in the format specified in the format String, convert it to a result format so that it can be read by new Date()
  if (!isNaN(parsedDate.getTime())) {
    return format(parsedDate, resultString);
  }

  // If the date is not in the format specified, return the current date instead in proper format
  return format(new Date(), resultString);
};

export default convertDateFormat;
