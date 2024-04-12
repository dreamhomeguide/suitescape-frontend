import React, { createContext, useContext, useState } from "react";

export const VideoFiltersContext = createContext({
  videoFilters: null,
  setVideoFilters: (_videoFilters) => {},
});

export const VideoFiltersProvider = ({ children }) => {
  const [videoFilters, setVideoFilters] = useState(null);

  return (
    <VideoFiltersContext.Provider value={{ videoFilters, setVideoFilters }}>
      {children}
    </VideoFiltersContext.Provider>
  );
};

export const useVideoFilters = () => {
  const context = useContext(VideoFiltersContext);
  if (context === undefined) {
    throw new Error(
      "useVideoFilters must be used within a VideoFiltersProvider",
    );
  }
  return context;
};
