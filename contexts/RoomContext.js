import React, { createContext, useContext, useState } from "react";

export const RoomContext = createContext(undefined);

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
