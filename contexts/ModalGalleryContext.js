import { setStatusBarStyle } from "expo-status-bar";
import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export const ModalGalleryContext = createContext(undefined);

export const ModalGalleryProvider = ({ children }) => {
  const [isPhotoGalleryShown, setIsPhotoGalleryShown] = useState(false);
  const [isVideoGalleryShown, setIsVideoGalleryShown] = useState(false);
  const [index, setIndex] = useState(0);

  const colorScheme = useColorScheme();

  const showPhotoGallery = () => {
    setStatusBarStyle("dark");

    setIsPhotoGalleryShown(true);
  };
  const showVideoGallery = () => {
    setStatusBarStyle("light");

    setIsVideoGalleryShown(true);
  };

  const closePhotoGallery = () => {
    if (colorScheme === "dark") {
      setStatusBarStyle("light");
    }

    setIsPhotoGalleryShown(false);
  };
  const closeVideoGallery = () => {
    if (colorScheme === "light") {
      setStatusBarStyle("dark");
    }

    setIsVideoGalleryShown(false);
  };

  const photoGalleryContext = {
    isPhotoGalleryShown,
    showPhotoGallery,
    closePhotoGallery,
  };

  const videoGalleryContext = {
    isVideoGalleryShown,
    showVideoGallery,
    closeVideoGallery,
  };

  const modalGalleryContext = {
    index,
    setIndex,
    ...photoGalleryContext,
    ...videoGalleryContext,
  };

  return (
    <ModalGalleryContext.Provider value={modalGalleryContext}>
      {children}
    </ModalGalleryContext.Provider>
  );
};

export const useModalGallery = () => {
  const context = useContext(ModalGalleryContext);
  if (context === undefined) {
    throw new Error(
      "useModalGallery must be used within a ModalGalleryProvider",
    );
  }
  return context;
};
