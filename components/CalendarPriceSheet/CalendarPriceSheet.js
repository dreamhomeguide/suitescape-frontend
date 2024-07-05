import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../../assets/Colors";
import globalStyles from "../../assets/styles/globalStyles";
import AppFooter from "../AppFooter/AppFooter";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import ButtonLarge, { BUTTON_LARGE_HEIGHT } from "../ButtonLarge/ButtonLarge";
import FormInputSheet from "../FormInputSheet/FormInputSheet";
import PriceInput from "../PriceInput/PriceInput";

const CalendarPriceSheet = ({
  isVisible,
  currentPrice,
  specialRate,
  headerLabel,
  onApplyChanges,
  onClose,
  hasTitle,
}) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Update the price when the calendar price changes
    if (isVisible) {
      setPrice(currentPrice);
      setTitle(specialRate?.title);
    }
  }, [isVisible, currentPrice, specialRate?.title]);

  const isNotChanged = useMemo(() => {
    if (!currentPrice) {
      return true;
    }
    return (
      currentPrice === price && title === specialRate?.title && !isEditable
    );
  }, [currentPrice, isEditable, price, specialRate?.title, title]);

  const handleHeaderClose = useCallback(() => {
    if (isNotChanged) {
      onClose();
      return;
    }

    Alert.alert(
      "Discard Changes?",
      "Are you sure you want to discard changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: onClose,
        },
      ],
    );
  }, [isNotChanged, onClose]);

  const onApplyPrice = useCallback(() => {
    onApplyChanges && onApplyChanges(price, title);
    onClose();
  }, [onApplyChanges, onClose, price, title]);

  const onRemovePrice = useCallback(() => {
    onApplyChanges && onApplyChanges(null);
    onClose();
  }, [onApplyChanges, onClose]);

  const isFooterButtonDisabled = useMemo(() => {
    return isEditable || isNotChanged || (hasTitle && !title);
  }, [isEditable, isNotChanged, hasTitle, title]);

  const renderFooter = useCallback(
    ({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <AppFooter>
          <View style={globalStyles.buttonRow}>
            {specialRate && (
              <ButtonLarge
                flexFull
                onPress={onRemovePrice}
                disabled={isEditable}
                color={Colors.red}
              >
                Remove Price
              </ButtonLarge>
            )}
            <ButtonLarge
              flexFull
              onPress={onApplyPrice}
              disabled={isFooterButtonDisabled}
            >
              Apply Price
            </ButtonLarge>
          </View>
        </AppFooter>
      </BottomSheetFooter>
    ),
    [isEditable, isFooterButtonDisabled, onApplyPrice, onRemovePrice],
  );

  return (
    <BottomSheet
      visible={isVisible}
      footerComponent={renderFooter}
      enablePanDownToClose={isNotChanged}
      dismissOnBackdropPress={isNotChanged}
      onDismiss={onClose}
      fullScreen
    >
      <BottomSheetHeader label={headerLabel} onClose={handleHeaderClose} />

      <View
        style={{
          ...globalStyles.flexCenter,
          paddingBottom: BUTTON_LARGE_HEIGHT + insets.bottom,
        }}
      >
        <PriceInput
          price={price}
          onPriceChange={setPrice}
          defaultPrice={currentPrice}
          isEditable={isEditable}
          onEditableChange={setIsEditable}
        />

        {hasTitle && (
          <FormInputSheet
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title here (Required)"
            style={{ fontSize: 16 }}
            bordersEnabled={false}
            numberOfLines={1}
          />
        )}
      </View>
    </BottomSheet>
  );
};

export default memo(CalendarPriceSheet);
