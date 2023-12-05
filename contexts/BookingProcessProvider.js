import React from "react";

import { BookingProvider } from "./BookingContext";
import { ListingProvider } from "./ListingContext";
import { RoomProvider } from "./RoomContext";

const BookingProcessProvider = ({ children }) => {
  return (
    <ListingProvider>
      <RoomProvider>
        <BookingProvider>{children}</BookingProvider>
      </RoomProvider>
    </ListingProvider>
  );
};

export default BookingProcessProvider;
