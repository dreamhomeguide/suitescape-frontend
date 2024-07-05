import { addHours, format } from "date-fns";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Checkbox } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import {
  MAXIMUM_STAY_HOURS,
  MINIMUM_STAY_HOURS,
} from "../../contexts/CreateListingContext";
import convertDateFormat from "../../utils/dateConverter";
import getTotalHours from "../../utils/totalHoursUpdater";
import FormInput, { VALID_INPUT_TIME } from "../FormInput/FormInput";

const ListingTimeSelector = ({
  checkInTime,
  checkOutTime,
  totalHours,
  onTimeChange,
  onTotalHoursChange,
  initialIsSameDay = false,
}) => {
  const [isSameDay, setIsSameDay] = useState(initialIsSameDay);

  // Reset the same day state when the initial value changes
  useEffect(() => {
    setIsSameDay(initialIsSameDay);
  }, [initialIsSameDay]);

  const onTotalHoursError = useCallback(
    // If the check-out time is set, but the total hours is invalid, show an alert
    (error) => {
      setIsSameDay((prev) => {
        if (prev) {
          Alert.alert(error.message);
        }
        return false;
      });
    },
    [],
  );

  const onSameDayPress = useCallback(() => {
    let sameDay;

    setIsSameDay((prev) => {
      sameDay = !prev;
      return !prev;
    });

    // If the check-out time is set, update the total hours
    if (checkOutTime) {
      const currentTotalHours = getTotalHours(
        checkInTime,
        checkOutTime,
        sameDay,
        onTotalHoursError,
      );

      // If the total hours is the same as the current total hours, revert the same day state
      if (currentTotalHours === totalHours) {
        sameDay = !sameDay;
      }

      onTotalHoursChange && onTotalHoursChange(currentTotalHours, sameDay);
    }
  }, [
    checkInTime,
    checkOutTime,
    onTotalHoursChange,
    onTotalHoursError,
    totalHours,
  ]);

  return (
    <>
      <FormInput
        type="time"
        label="Check-in Time"
        value={checkInTime}
        placeholder="Check-in Time"
        onDateConfirm={(_checkIn, checkInText) => {
          onTimeChange && onTimeChange(checkInText, "checkInTime");

          // If check-out time is not set, set it to 18 hours after check-in time
          let newCheckOut = checkOutTime;
          if (!newCheckOut) {
            const checkInDate = new Date(
              convertDateFormat(checkInText, "datetime", VALID_INPUT_TIME),
            );

            // Add 18 hours to check in date
            const checkOutDate = addHours(checkInDate, MINIMUM_STAY_HOURS);

            // Convert check-out date to time format
            newCheckOut = format(checkOutDate, VALID_INPUT_TIME);

            onTimeChange && onTimeChange(newCheckOut, "checkOutTime");
          }

          const newTotalHours = getTotalHours(
            checkInText,
            newCheckOut,
            isSameDay,
            onTotalHoursError,
          );

          onTotalHoursChange && onTotalHoursChange(newTotalHours, isSameDay);
        }}
      />

      <FormInput
        type="time"
        label="Check-out Time"
        value={checkOutTime}
        placeholder="Check-out Time"
        onDateConfirm={(_checkOut, checkOutText) => {
          onTimeChange && onTimeChange(checkOutText, "checkOutTime");

          const newTotalHours = getTotalHours(
            checkInTime,
            checkOutText,
            isSameDay,
            onTotalHoursError,
          );

          onTotalHoursChange && onTotalHoursChange(newTotalHours, isSameDay);
        }}
      />

      <Pressable
        onPress={onSameDayPress}
        style={({ pressed }) => ({
          ...style.checkboxContainer,
          ...pressedOpacity(pressed),
        })}
      >
        <Checkbox
          value={isSameDay}
          size={23}
          color={Colors.blue}
          style={style.checkbox}
        />
        <Text style={style.hint}>
          {isSameDay ? "Same day" : "Next day"} check-out
        </Text>
      </Pressable>

      {totalHours >= 0 && (
        <View style={style.hintContainer}>
          <Text>
            <Text style={style.hint}>Total:</Text> {totalHours}{" "}
            {totalHours === 1 ? "hour" : "hours"}
            {totalHours < MINIMUM_STAY_HOURS && (
              <Text style={{ color: "red" }}>
                {" "}
                (Minimum stay is {MINIMUM_STAY_HOURS} hours)
              </Text>
            )}
            {totalHours > MAXIMUM_STAY_HOURS && (
              <Text style={{ color: "red" }}>
                {" "}
                (Maximum stay is {MAXIMUM_STAY_HOURS} hours)
              </Text>
            )}
          </Text>
        </View>
      )}
    </>
  );
};

export default memo(ListingTimeSelector);
