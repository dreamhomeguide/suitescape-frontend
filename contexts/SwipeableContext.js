import { createContext, useCallback, useContext } from "react";

export const SwipeableContext = createContext(null);

export const SwipeableProvider = ({ children, value }) => {
  return (
    <SwipeableContext.Provider value={value}>
      {children}
    </SwipeableContext.Provider>
  );
};

export const useOnSwipeableWillOpen = (swipeRef) => {
  const { currentSwipeRef } = useSwipeableContext() || {};

  return useCallback(() => {
    if (currentSwipeRef && currentSwipeRef.current !== null) {
      if (currentSwipeRef.current !== swipeRef.current) {
        currentSwipeRef.current?.close();
      }
    }
    currentSwipeRef.current = swipeRef.current;
  }, [currentSwipeRef]);
};

export const useSwipeableContext = () => {
  return useContext(SwipeableContext);
};
