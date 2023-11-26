import React, { createContext, useContext, useReducer } from "react";

export const BookingContext = createContext(undefined);

const initialState = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  address: "",
  zipCode: "",
  city: "",
  region: "",
  mobileNumber: "",
  message: "",
  startDate: "",
  endDate: "",
  nights: 0,
  amount: 0,
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
