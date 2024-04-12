// noinspection JSCheckFunctionSignatures

import React, { createContext, useContext, useReducer } from "react";

// Data for the booking process
const initialState = {
  startDate: "",
  endDate: "",
  message: "",
  highlightedDates: [],
  disabledDates: [
    "2024-03-15",
    "2024-03-25",
    "2024-04-10",
    "2024-04-20",
    "2024-05-05",
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "CLEAR_DATES":
      return {
        ...state,
        startDate: "",
        endDate: "",
      };
    case "CLEAR_BOOKING_INFO":
      return initialState;
    default:
      return state;
  }
};

export const BookingContext = createContext({
  bookingState: initialState,
  setBookingData: (_payload) => {},
  clearBookingInfo: () => {},
  clearDates: () => {},
});

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const setBookingData = (payload) => {
    dispatch({ type: "SET_DATA", payload });
  };

  const clearBookingInfo = () => {
    dispatch({ type: "CLEAR_BOOKING_INFO" });
  };

  const clearDates = () => {
    dispatch({ type: "CLEAR_DATES" });
  };

  const bookingContext = {
    bookingState: state,
    setBookingData,
    clearBookingInfo,
    clearDates,
  };

  return (
    <BookingContext.Provider value={bookingContext}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
};
