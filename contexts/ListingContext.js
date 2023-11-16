import React, { createContext, useContext, useState } from "react";

export const ListingContext = createContext(undefined);

export const ListingProvider = ({ children }) => {
  const [listing, setListing] = useState(null);

  return (
    <ListingContext.Provider value={{ listing, setListing }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error("useListing must be used within a ListingProvider");
  }
  return context;
};
