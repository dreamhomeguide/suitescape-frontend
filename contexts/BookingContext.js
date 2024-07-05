// noinspection JSCheckFunctionSignatures

import React, { createContext, useContext, useMemo, useReducer } from "react";

import { useListingContext } from "./ListingContext";

const initialState = {
  listings: {},
};

// Data for the booking process
const initialBookingState = {
  startDate: "",
  endDate: "",
  message: "",
  highlightedDates: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKING_DATA": {
      const { listingId, ...rest } = action.payload;
      const listing = state.listings[listingId] || initialBookingState;

      const newListing = {
        ...listing,
        ...rest,
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "CLEAR_DATES": {
      const { listingId } = action.payload;

      const newListing = {
        ...state.listings[listingId],
        startDate: "",
        endDate: "",
      };

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: newListing,
        },
      };
    }
    case "CLEAR_BOOKING_INFO": {
      const { listingId } = action.payload;

      return {
        ...state,
        listings: {
          ...state.listings,
          [listingId]: initialBookingState,
        },
      };
    }
    case "CLEAR_ALL_BOOKING_INFO":
      return initialState;
    default:
      return state;
  }
};

export const BookingContext = createContext({
  bookingState: initialState,
  setBookingData: (_payload) => {},
  clearDates: (_listingId) => {},
  clearBookingInfo: (_listingId) => {},
  clearAllBookingInfo: () => {},
});

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const actions = {
    setBookingData: (payload) =>
      dispatch({
        type: "SET_BOOKING_DATA",
        payload,
      }),
    clearDates: (payload) =>
      dispatch({
        type: "CLEAR_DATES",
        payload,
      }),
    clearBookingInfo: (payload) =>
      dispatch({
        type: "CLEAR_BOOKING_INFO",
        payload,
      }),
    clearAllBookingInfo: () =>
      dispatch({
        type: "CLEAR_ALL_BOOKING_INFO",
      }),
  };

  const bookingContext = {
    bookingState: state,
    ...actions,
  };

  return (
    <BookingContext.Provider value={bookingContext}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingData = () => {
  const { bookingState } = useBookingContext();
  const { listing } = useListingContext();

  return useMemo(
    () => bookingState.listings[listing?.id] || initialBookingState,
    [bookingState.listings, listing?.id],
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
};
