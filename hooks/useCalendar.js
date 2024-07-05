import { useRoute } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  eachDayOfInterval,
  format,
  isFriday,
  isSaturday,
  isSunday,
  isWithinInterval,
} from "date-fns";
import { useCallback, useMemo } from "react";
import { useToast } from "react-native-toast-notifications";

import { RNC_DATE_FORMAT } from "./useDates";
import toastStyles from "../assets/styles/toastStyles";
import { useListingContext } from "../contexts/ListingContext";
import {
  addListingSpecialRate,
  addRoomSpecialRate,
  blockListingDates,
  blockRoomDates,
  fetchListing,
  fetchRoom,
  removeListingSpecialRate,
  removeRoomSpecialRate,
  unblockListingDates,
  unblockRoomDates,
  updateListingPrices,
  updateRoomPrices,
} from "../services/apiService";
import { handleApiError, handleApiResponse } from "../utils/apiHelpers";
import getPricesMapped from "../utils/getPricesMapped";

const useCalendar = (startDate = null, endDate = null) => {
  const { listing } = useListingContext();
  const queryClient = useQueryClient();
  const toast = useToast();
  const route = useRoute();

  const { id, type } = route.params || {};

  const calendarQueries = useMemo(
    () => ({
      entirePlace: {
        getData: {
          queryKey: ["listings", id],
          queryFn: () => fetchListing({ listingId: id, startDate, endDate }),
        },
      },
      room: {
        getData: {
          queryKey: ["rooms", id],
          queryFn: () => fetchRoom({ roomId: id, startDate, endDate }),
          select: ({ category, ...data }) => ({
            ...category,
            ...data,
          }),
        },
      },
    }),
    [id, startDate, endDate],
  );

  const dataQuery = useQuery({
    ...calendarQueries[type].getData,
    enabled: !!id,
  });

  const calendarPrices = useMemo(() => {
    const specialRates = dataQuery.data?.special_rates.reduce((acc, rate) => {
      const interval = eachDayOfInterval({
        start: rate.start_date,
        end: rate.end_date,
      });

      // Map each date to the special rate
      interval.forEach((date) => {
        acc[format(date, RNC_DATE_FORMAT)] = {
          id: rate.id,
          price: rate.price,
          title: rate.title,
          startDate: rate.start_date,
          endDate: rate.end_date,
        };
      });

      return acc;
    }, {});

    return {
      ...getPricesMapped(type, dataQuery.data),
      specialRates,
    };
  }, [type, dataQuery.data]);

  const getSpecialRate = useCallback(
    (dateString) => {
      // You can also just use the find method on the special_rates here (but it's slower)
      return calendarPrices.specialRates?.[dateString];
    },
    [calendarPrices],
  );

  const getCalendarPrice = useCallback(
    (dateString) => {
      // Check for special rates first
      const specialRate = getSpecialRate(dateString);
      if (specialRate) {
        return specialRate.price;
      }

      // Determine if the date is a weekend
      const isWeekend =
        isFriday(dateString) || isSaturday(dateString) || isSunday(dateString);

      // Return the appropriate price based on whether it's a weekend or a weekday
      return isWeekend
        ? calendarPrices.weekendPrice
        : calendarPrices.weekdayPrice;
    },
    [calendarPrices, getSpecialRate],
  );

  const getSpecialRatesRange = useCallback(
    (startDate, endDate) => {
      const specialRates = dataQuery.data?.special_rates || [];

      return specialRates.filter((specialRate) => {
        const specialRateDays = eachDayOfInterval({
          start: specialRate.start_date,
          end: specialRate.end_date,
        });

        return specialRateDays.some((day) => {
          const formattedDay = format(day, RNC_DATE_FORMAT);
          return isWithinInterval(formattedDay, {
            start: startDate,
            end: endDate || startDate,
          });
        });
      });
    },
    [dataQuery.data],
  );

  const getUnavailableDatesRange = useCallback(
    (startDate, endDate) => {
      const unavailableDates = dataQuery.data?.unavailable_dates || [];

      return unavailableDates.filter((unavailableDate) =>
        isWithinInterval(unavailableDate.date, {
          start: startDate,
          end: endDate || startDate,
        }),
      );
    },
    [dataQuery.data],
  );

  const handleOnSuccess = useCallback(
    (response) =>
      handleApiResponse({
        response,
        onSuccess: async (res) => {
          await queryClient.invalidateQueries({
            queryKey: type === "entirePlace" ? ["listings", id] : ["rooms", id],
          });

          if (type === "room") {
            await queryClient.invalidateQueries({
              queryKey: ["listings", listing?.id, "rooms"],
            });
          }

          toast.show(res.message, {
            type: "success",
            style: toastStyles.toastInsetBottom,
          });
        },
      }),
    [id, type, queryClient, listing?.id, toast],
  );

  const handleOnError = useCallback(
    (err) => handleApiError({ error: err, defaultAlert: true }),
    [],
  );

  const addSpecialRateMutation = useMutation({
    mutationFn: ({ title, price, startDate, endDate }) =>
      type === "entirePlace"
        ? addListingSpecialRate({
            listingId: id,
            title,
            price,
            startDate,
            endDate,
          })
        : addRoomSpecialRate({ roomId: id, title, price, startDate, endDate }),
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  const removeSpecialRateMutation = useMutation({
    mutationFn: ({ specialRateId }) =>
      type === "entirePlace"
        ? removeListingSpecialRate({ listingId: id, specialRateId })
        : removeRoomSpecialRate({ roomId: id, specialRateId }),
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  const updatePricesMutation = useMutation({
    mutationFn: ({ weekdayPrice, weekendPrice }) =>
      type === "entirePlace"
        ? updateListingPrices({ listingId: id, weekdayPrice, weekendPrice })
        : updateRoomPrices({ roomId: id, weekdayPrice, weekendPrice }),
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: ({ isAvailable, startDate, endDate }) => {
      const actions = {
        block: type === "entirePlace" ? blockListingDates : blockRoomDates,
        unblock:
          type === "entirePlace" ? unblockListingDates : unblockRoomDates,
      };

      // Define the key based on type
      const idKey = type === "entirePlace" ? "listingId" : "roomId";

      // Determine action based on availability
      const actionType = isAvailable ? "unblock" : "block";

      // Execute the method
      return actions[actionType]({
        [idKey]: id,
        startDate,
        endDate,
      });
    },
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  return {
    dataQuery,
    calendarPrices,
    getCalendarPrice,
    getSpecialRate,
    getSpecialRatesRange,
    getUnavailableDatesRange,
    addSpecialRateMutation,
    removeSpecialRateMutation,
    updatePricesMutation,
    updateAvailabilityMutation,
  };
};

export default useCalendar;
