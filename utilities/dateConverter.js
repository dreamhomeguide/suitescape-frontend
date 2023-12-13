import { format, parse } from "date-fns";

const RESULT_DATE_FORMAT = "yyyy-MM-dd";

const convertMMDDYYYY = (dateString) => {
  const parsedDate = parse(dateString, "MM/dd/yyyy", new Date());

  // If the date is in the format MM/dd/yyyy, convert it to yyyy-MM-dd so that it can be read by new Date()
  if (!isNaN(parsedDate.getTime())) {
    return format(parsedDate, RESULT_DATE_FORMAT);
  }

  // If the date is not in the "MM/dd/yyyy" format, return the current date in "yyyy-MM-dd" format
  return format(new Date(), RESULT_DATE_FORMAT);
};

export default convertMMDDYYYY;
