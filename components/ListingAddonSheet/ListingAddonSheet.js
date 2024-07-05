import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useMemo } from "react";
import { Alert, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Checkbox } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import { checkEmptyFieldsObj } from "../../utils/emptyFieldChecker";
import checkIfValidPrice from "../../utils/priceValidator";
import BottomSheet from "../BottomSheet/BottomSheet";
import BottomSheetHeader from "../BottomSheetHeader/BottomSheetHeader";
import FormInputSheet from "../FormInputSheet/FormInputSheet";
import FormStepper from "../FormStepper/FormStepper";

const ListingAddonSheet = ({
  isVisible,
  currentAddon,
  onAddonChange,
  onClose,
  headerLabel,
  footerComponent,
}) => {
  const insets = useSafeAreaInsets();

  const isNotChanged = useMemo(() => {
    if (!currentAddon) {
      return true;
    }
    return checkEmptyFieldsObj(currentAddon, ["id", "is_consumable"], true);
  }, [currentAddon]);

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

  return (
    <BottomSheet
      visible={isVisible}
      footerComponent={footerComponent}
      enablePanDownToClose={isNotChanged}
      dismissOnBackdropPress={isNotChanged}
      onDismiss={onClose}
      fullScreen
    >
      <BottomSheetHeader label={headerLabel} onClose={handleHeaderClose} />

      <BottomSheetScrollView
        contentContainerStyle={style.sheetContainer}
        contentInset={{ bottom: insets.bottom }}
      >
        <FormInputSheet
          label="Addon Name"
          placeholder="Enter addon name"
          value={currentAddon.name}
          autoCorrect={false}
          onChangeText={(value) => onAddonChange?.({ name: value })}
        />

        <FormInputSheet
          type="currency"
          label="Price"
          placeholder="Enter price"
          isNumberValue={false}
          value={currentAddon.price}
          onChangeText={(value) => onAddonChange?.({ price: value })}
          onBlur={() => {
            const newPrice = Number(currentAddon.price);

            if (!checkIfValidPrice(newPrice)) {
              onAddonChange({ price: "" });
              return;
            }

            onAddonChange?.({
              price: isNaN(newPrice) ? "" : newPrice.toFixed(2),
            });
          }}
          keyboardType="number-pad"
        />

        <Pressable
          onPress={() => {
            onAddonChange?.({
              is_consumable: !currentAddon.is_consumable,
              quantity: -1,
            });
          }}
          style={({ pressed }) => ({
            ...style.checkboxContainer,
            ...pressedOpacity(pressed),
          })}
        >
          <Checkbox
            value={currentAddon.is_consumable}
            size={23}
            color={Colors.blue}
            style={style.checkbox}
          />
          <Text style={style.hint}>
            Consumable (Limited quantity, e.g. food, drinks)
          </Text>
        </Pressable>

        {currentAddon.is_consumable && (
          <FormStepper
            label="Quantity"
            placeholder="Quantity"
            value={currentAddon.quantity}
            onValueChange={(value) => onAddonChange?.({ quantity: value })}
            useFormInputSheet
          />
        )}

        <FormInputSheet
          type="textarea"
          label="Description (Optional)"
          placeholder="Enter addon description"
          value={currentAddon.description}
          onChangeText={(value) => onAddonChange?.({ description: value })}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default memo(ListingAddonSheet);
