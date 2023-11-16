import { createContext, useContext } from "react";

export const VideoScrollContext = createContext(undefined);

export const useVideoScroll = () => {
  const context = useContext(VideoScrollContext);
  if (context === undefined) {
    throw new Error("useVideoScroll must be used within a VideoScrollProvider");
  }
  return context;
};
