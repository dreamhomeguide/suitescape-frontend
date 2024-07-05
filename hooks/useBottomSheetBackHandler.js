import { useCallback, useRef } from "react";
import { BackHandler } from "react-native";

const useBottomSheetBackHandler = (bottomSheetRef) => {
  const backHandlerSubscriptionRef = useRef(null);

  const handleSheetPositionChange = useCallback(
    (index) => {
      const isBottomSheetVisible = index >= 0;

      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // Set up the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            bottomSheetRef.current?.dismiss();
            return true;
          },
        );
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );

  return { handleSheetPositionChange };
};

export default useBottomSheetBackHandler;
