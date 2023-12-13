import React, { createContext, useContext, useState } from "react";

export const VideoFilterContext = createContext(undefined);

export const VideoFilterProvider = ({ children }) => {
  const [videoFilter, setVideoFilter] = useState(null);

  return (
    <VideoFilterContext.Provider value={{ videoFilter, setVideoFilter }}>
      {children}
    </VideoFilterContext.Provider>
  );
};

export const useVideoFilter = () => {
  const context = useContext(VideoFilterContext);
  if (context === undefined) {
    throw new Error("useVideoFilter must be used within a VideoFilterProvider");
  }
  return context;
};
