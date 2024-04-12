import { setStatusBarStyle } from "expo-status-bar";
import React, { createContext, useCallback, useContext, useState } from "react";

const initialState = {
  index: 0,
  isPhotoGalleryShown: false,
  isVideoGalleryShown: false,
};

export const ModalGalleryContext = createContext({
  ...initialState,
  setIndex: (_index) => {},
  showPhotoGallery: () => {},
  closePhotoGallery: () => {},
  showVideoGallery: () => {},
  closeVideoGallery: () => {},
});

export const ModalGalleryProvider = ({ children }) => {
  const [index, setIndex] = useState(initialState.index);
  const [isPhotoGalleryShown, setIsPhotoGalleryShown] = useState(
    initialState.isPhotoGalleryShown,
  );
  const [isVideoGalleryShown, setIsVideoGalleryShown] = useState(
    initialState.isVideoGalleryShown,
  );

  // const colorScheme = useColorScheme();

  const showPhotoGallery = useCallback(() => {
    setStatusBarStyle("dark", true);

    setIsPhotoGalleryShown(true);
  }, []);

  const showVideoGallery = useCallback(() => {
    // setStatusBarStyle("light", true);

    setIsVideoGalleryShown(true);
  }, []);

  const closePhotoGallery = useCallback(() => {
    // if (colorScheme === "dark") {
    //   setStatusBarStyle("light", true);
    // }
    setStatusBarStyle("light", true);

    setIsPhotoGalleryShown(false);
  }, []);

  const closeVideoGallery = useCallback(() => {
    // if (colorScheme === "light") {
    //   setStatusBarStyle("dark");
    // }

    setIsVideoGalleryShown(false);
  }, []);

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
