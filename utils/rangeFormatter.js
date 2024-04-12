import { format } from "date-fns";

const formatRange = (start, end) => {
  const startDate = new Date(start || new Date());
  const endDate = new Date(end || startDate);

  const isThisYear = new Date().getFullYear() === endDate.getFullYear();
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const isSameDay = startDate.getTime() === endDate.getTime();

  if (isSameDay) {
    return isThisYear
      ? format(startDate, "MMM d")
      : format(startDate, "MMM d, yyyy");
  } else if (isSameMonth && isThisYear) {
    return `${format(startDate, "MMM d")} - ${format(endDate, "d")}`;
  } else if (isThisYear) {
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
  } else {
    return `${format(startDate, "MMM d, yyyy")} - ${format(
      endDate,
      "MMM d, yyyy",
    )}`;
  }
};

export default formatRange;
