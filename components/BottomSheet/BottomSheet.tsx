import GorhomBottomSheet, {
  BottomSheetProps,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import style from "./BottomSheetStyles";
import useBottomSheetBackHandler from "../../hooks/useBottomSheetBackHandler";

export type CustomBottomSheetProps = BottomSheetProps &
  BottomSheetModalProps & {
    children: React.ReactNode;
    visible: boolean;
    modal?: boolean;
    fullScreen?: boolean;
    enableShadow?: boolean;
    enableBackdrop?: boolean;
    dismissOnBackdropPress?: boolean;
    backdropProps?: BottomSheetDefaultBackdropProps;
  };

const DEFAULT_SNAP_POINTS = ["65%", "90%"];
const FULL_SCREEN_SNAP_POINTS = ["90%"];
const CLOSED_SNAP_POINTS = ["1%"];
const OPEN_SHEET_INDEX = 0;

const BottomSheet = forwardRef(
  (
    {
      visible,
      children,
      modal = true,
      fullScreen = false,
      enableShadow = true,
      enableBackdrop = true,
      dismissOnBackdropPress = true,
      snapPoints: propsSnapPoints,
      style: propsStyle,
      backdropProps,
      ...props
    }: CustomBottomSheetProps,
    ref,
  ) => {
    const bottomSheetRef = useRef(null);

    useImperativeHandle(ref, () => bottomSheetRef.current);

    const { handleSheetPositionChange } =
      useBottomSheetBackHandler(bottomSheetRef);

    const snapPoints = useMemo(() => {
      if (propsSnapPoints) {
        return propsSnapPoints;
      }
      return fullScreen ? FULL_SCREEN_SNAP_POINTS : DEFAULT_SNAP_POINTS;
    }, [fullScreen, propsSnapPoints]);

    const handlePresentModalPress = useCallback(() => {
      if (modal) {
        bottomSheetRef.current?.present();
      } else {
        bottomSheetRef.current?.expand();
      }
    }, [modal]);

    const handleDismissModalPress = useCallback(() => {
      if (modal) {
        bottomSheetRef.current?.dismiss();
      } else {
        bottomSheetRef.current?.close();
      }
    }, [modal]);

    useEffect(() => {
      if (visible) {
        handlePresentModalPress();
      } else {
        handleDismissModalPress();
      }
    }, [visible, handlePresentModalPress, handleDismissModalPress]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => {
        if (!enableBackdrop) {
          return null;
        }

        return (
          <BottomSheetBackdrop
            {...props}
            {...backdropProps}
            opacity={0.4}
            pressBehavior={dismissOnBackdropPress ? "close" : "none"}
            appearsOnIndex={1}
            disappearsOnIndex={-1}
          />
        );
      },
      [backdropProps, dismissOnBackdropPress, enableBackdrop],
    );

    const BottomSheet = modal ? BottomSheetModal : GorhomBottomSheet;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={visible ? OPEN_SHEET_INDEX : -1}
        onChange={handleSheetPositionChange}
        snapPoints={visible ? snapPoints : CLOSED_SNAP_POINTS} // Fixes bug where sheet is not closed when visible is false
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={style.handleIndicator}
        style={[style.container, enableShadow && style.shadows, propsStyle]}
        {...props}
      >
        {children}
      </BottomSheet>
    );
  },
);

export default memo(BottomSheet);
