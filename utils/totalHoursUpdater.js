import { differenceInHours, isAfter, isBefore } from "date-fns";

import convertDateFormat from "./dateConverter";
import { VALID_INPUT_TIME } from "../components/FormInput/FormInput";

const getTotalHours = (checkInTime, checkOutTime, isSameDay, onError) => {
  if (checkInTime && checkOutTime) {
    const checkInDate = new Date(
      convertDateFormat(checkInTime, "datetime", VALID_INPUT_TIME),
    );
    let checkOutDate = new Date(
      convertDateFormat(checkOutTime, "datetime", VALID_INPUT_TIME),
    );

    // If check-out date is before check-in date, set it to the next day
    if (
      !isSameDay ||
      isBefore(checkOutDate, checkInDate) ||
      isAfter(checkInDate, checkOutDate)
    ) {
      checkOutDate = new Date(checkOutDate.setDate(checkOutDate.getDate() + 1));

      // Show alert if check-out date is set to the next day
      onError && onError({ message: "Check-in time is after check-out time." });
    }

    // Calculate the total hours between check-in and check-out
    return differenceInHours(checkOutDate, checkInDate);
  }
};

export default getTotalHours;
