import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";

import style from "./ModalBottomSheetStyles";

const ModalBottomSheet = ({ visible, onDismiss, children, ...props }) => {
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["65%", "90%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    if (visible) {
      handlePresentModalPress();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.4}
        pressBehavior="close"
        appearsOnIndex={1}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={style.handleIndicator}
      style={style.container}
      {...props}
    >
      {children}
    </BottomSheetModal>
  );
};

export default memo(ModalBottomSheet);
