import React from "react";

import { BookingProvider } from "./BookingContext";
import { CartProvider } from "./CartContext";
import { ListingProvider } from "./ListingContext";
import { RoomProvider } from "./RoomContext";

const BookingProcessProvider = ({ children }) => {
  return (
    <ListingProvider>
      <RoomProvider>
        <CartProvider>
          <BookingProvider>{children}</BookingProvider>
        </CartProvider>
      </RoomProvider>
    </ListingProvider>
  );
};

export default BookingProcessProvider;
