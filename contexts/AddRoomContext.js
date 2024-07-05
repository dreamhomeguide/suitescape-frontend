import { createContext, useContext } from "react";

export const AddRoomContext = createContext({
  setCurrentRoom: (_payload) => {},
  setRoomCategory: (_payload) => {},
  setRoomAmenities: (_payload) => {},
  setRoomRule: (_payload) => {},
  clearCurrentRoom: (_payload) => {},
});

export const AddRoomProvider = ({ value, children }) => {
  return (
    <AddRoomContext.Provider value={value}>{children}</AddRoomContext.Provider>
  );
};

export const useAddRoomContext = () => {
  const context = useContext(AddRoomContext);
  if (context === undefined) {
    throw new Error("useAddRoomContext must be used within a AddRoomProvider");
  }
  return context;
};
