import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import { isEqual } from "date-fns";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Chip } from "react-native-ui-lib";

import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import useCalendar from "../../hooks/useCalendar";
import formatRange from "../../utils/rangeFormatter";
import AppFooter from "../AppFooter/AppFooter";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import ButtonLarge, { BUTTON_LARGE_HEIGHT } from "../ButtonLarge/ButtonLarge";
import CalendarAvailabilitySheet from "../CalendarAvailabilitySheet/CalendarAvailabilitySheet";
import CalendarPriceSheet from "../CalendarPriceSheet/CalendarPriceSheet";
import PriceInput from "../PriceInput/PriceInput";

const CalendarDateSheet = ({ startDate, endDate, onClose }) => {
  const [isPriceSheetVisible, setIsPriceSheetVisible] = useState(false);
  const [isAvailabilitySheetVisible, setIsAvailabilitySheetVisible] =
    useState(false);

  const insets = useSafeAreaInsets();
  const {
    getCalendarPrice,
    getSpecialRate,
    getSpecialRatesRange,
    getUnavailableDatesRange,
    addSpecialRateMutation,
    removeSpecialRateMutation,
    updateAvailabilityMutation,
  } = useCalendar(startDate, endDate);

  const snapPoints = useMemo(() => ["45%"], []);

  const currentSpecialRate = useMemo(() => {
    return getSpecialRate(startDate);
  }, [getSpecialRate, startDate]);

  const currentPrice = useMemo(
    () => getCalendarPrice(startDate),
    [getCalendarPrice, startDate],
  );

  const specialRatesFromSelected = useMemo(() => {
    return getSpecialRatesRange(startDate, endDate);
  }, [getSpecialRatesRange, startDate, endDate]);

  const unavailableDatesFromSelected = useMemo(
    () => getUnavailableDatesRange(startDate, endDate),
    [getUnavailableDatesRange, endDate, startDate],
  );

  const headerLabel = useMemo(
    () => formatRange(startDate, endDate),
    [startDate, endDate],
  );

  const specialRateDateFormatted = useMemo(() => {
    if (!currentSpecialRate) {
      return "";
    }

    return formatRange(
      currentSpecialRate.startDate,
      currentSpecialRate.endDate,
    );
  }, [currentSpecialRate?.startDate, currentSpecialRate?.endDate]);

  // const fallsOnWeekend = useMemo(() => {
  //   if (!startDate || !endDate) {
  //     return false;
  //   }
  //
  //   // Check if the date range falls on a weekend
  //   const weekends = eachWeekendOfInterval({
  //     start: startDate,
  //     end: endDate,
  //   });
  //
  //   return Boolean(weekends.length);
  // }, [startDate, endDate]);

  const onRemovePrice = useCallback(() => {
    if (!removeSpecialRateMutation.isPending && currentSpecialRate?.id) {
      removeSpecialRateMutation.mutate({
        specialRateId: currentSpecialRate.id,
      });
    }
  }, [currentSpecialRate?.id, removeSpecialRateMutation.isPending]);

  const onApplyPrice = useCallback(
    (value, title) => {
      if (!addSpecialRateMutation.isPending) {
        addSpecialRateMutation.mutate({
          title,
          price: value,
          startDate,
          endDate: endDate || startDate,
        });
      }
    },
    [addSpecialRateMutation.isPending, endDate, startDate],
  );

  const handlePriceChange = useCallback(
    (value, title) => {
      if (value === null) {
        Alert.alert(
          "Remove Special Rate?",
          "Are you sure you want to remove the special rate?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Remove",
              style: "destructive",
              onPress: onRemovePrice,
            },
          ],
        );
        return;
      }

      onApplyPrice(value, title);
    },
    [onApplyPrice, onRemovePrice],
  );

  const validateAddSpecialRate = useCallback(() => {
    const hasCurrentSpecialRate = Boolean(currentSpecialRate);
    const hasSpecialRates = specialRatesFromSelected.length > 0;
    const hasMultipleSpecialRates = specialRatesFromSelected.length > 1;
    const startDateMismatch = !isEqual(
      currentSpecialRate?.startDate,
      startDate,
    );
    const endDateMismatch = !isEqual(
      currentSpecialRate?.endDate,
      endDate || startDate,
    );

    const isConflict =
      (!hasCurrentSpecialRate && hasSpecialRates) ||
      (hasCurrentSpecialRate &&
        (hasMultipleSpecialRates || startDateMismatch || endDateMismatch));

    if (isConflict) {
      Alert.alert(
        "Special Rate Conflict",
        "You cannot set a special rate when there are other special rates set for this date range.",
      );

      return false;
    }

    return true;
  }, [currentSpecialRate, endDate, specialRatesFromSelected, startDate]);

  const onApplyAvailability = useCallback(
    (value) => {
      if (!updateAvailabilityMutation.isPending) {
        updateAvailabilityMutation.mutate({
          isAvailable: value,
          startDate,
          endDate: endDate || startDate,
        });
      }
    },
    [endDate, startDate, updateAvailabilityMutation.isPending],
  );

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <ButtonLarge
            onPress={() => setIsAvailabilitySheetVisible(true)}
            disabled={!startDate}
          >
            Edit Availability
          </ButtonLarge>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [startDate],
  );

  return (
    <>
      <BottomSheet
        snapPoints={snapPoints}
        visible={!!startDate}
        onDismiss={onClose}
        enableBackdrop={false}
        footerComponent={renderFooter}
      >
        <BottomSheetHeader label={headerLabel} onClose={onClose} />

        <View
          style={{
            ...globalStyles.flexCenter,
            padding: 20,
            paddingBottom: insets.bottom + BUTTON_LARGE_HEIGHT,
          }}
        >
          <Pressable
            style={({ pressed }) => pressedOpacity(pressed)}
            onPress={() => {
              if (validateAddSpecialRate()) {
                setIsPriceSheetVisible(true);
              }
            }}
            pointerEvents="box-only"
          >
            <PriceInput price={currentPrice} />
          </Pressable>

          <Text>per night</Text>

          {currentSpecialRate && (
            <Chip
              label={`${specialRateDateFormatted} - ${currentSpecialRate.title}`}
              containerStyle={{ margin: 20 }}
            />
          )}
        </View>
      </BottomSheet>

      <CalendarPriceSheet
        isVisible={isPriceSheetVisible}
        currentPrice={currentPrice}
        specialRate={currentSpecialRate}
        headerLabel={headerLabel}
        onApplyChanges={handlePriceChange}
        onClose={() => setIsPriceSheetVisible(false)}
        hasTitle
      />

      <CalendarAvailabilitySheet
        isVisible={isAvailabilitySheetVisible}
        currentIsAvailable={unavailableDatesFromSelected?.length > 0}
        headerLabel={headerLabel}
        onApplyChanges={onApplyAvailability}
        onClose={() => setIsAvailabilitySheetVisible(false)}
        snapPoints={snapPoints}
      />
    </>
  );
};

export default memo(CalendarDateSheet);
