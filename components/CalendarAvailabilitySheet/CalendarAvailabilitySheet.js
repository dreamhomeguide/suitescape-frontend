import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import AppFooter from "../AppFooter/AppFooter";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import ButtonLarge from "../ButtonLarge/ButtonLarge";
import FormRadio from "../FormRadio/FormRadio";

const CalendarAvailabilitySheet = ({
  isVisible,
  currentIsAvailable,
  headerLabel,
  onClose,
  onApplyChanges,
  snapPoints,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Update the availability when the calendar availability changes
    if (isVisible) {
      setIsAvailable(currentIsAvailable);
    }
  }, [isVisible, currentIsAvailable]);

  const onApplyAvailability = useCallback(() => {
    onApplyChanges && onApplyChanges(isAvailable);
    onClose();
  }, [isAvailable, onApplyChanges, onClose]);

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <ButtonLarge onPress={onApplyAvailability}>Apply Changes</ButtonLarge>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [onApplyAvailability],
  );

  return (
    <BottomSheet
      visible={isVisible}
      onDismiss={onClose}
      snapPoints={snapPoints}
      enableBackdrop={false}
      footerComponent={renderFooter}
    >
      <BottomSheetHeader label={headerLabel} onClose={onClose} />

      <View style={{ paddingHorizontal: 20, paddingVertical: 10, rowGap: 20 }}>
        <Text>Change the availability of the chosen dates</Text>

        <View style={{ rowGap: 20 }}>
          <Pressable
            onPress={() => setIsAvailable(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
              borderRadius: 10,
              backgroundColor: Colors.lightgray,
            }}
          >
            <Text>Mark as available</Text>
            <FormRadio selected={isAvailable} />
          </Pressable>

          <Pressable
            onPress={() => setIsAvailable(false)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20,
              borderRadius: 10,
              backgroundColor: Colors.lightgray,
            }}
          >
            <Text>Mark as unavailable</Text>
            <FormRadio selected={!isAvailable} />
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
};

export default memo(CalendarAvailabilitySheet);
