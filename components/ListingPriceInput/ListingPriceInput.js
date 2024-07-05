import React, { memo, useCallback, useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { Checkbox } from "react-native-ui-lib";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/createListingStyles";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import checkIfValidPrice, {
  MAX_PRICE_LENGTH,
} from "../../utils/priceValidator";
import FormInput from "../FormInput/FormInput";

const ListingPriceInput = ({
  weekDayPrice,
  weekendPrice,
  onWeekdayPriceChange,
  onWeekendPriceChange,
  initialIsSamePrice = false,
}) => {
  const [isSamePrice, setIsSamePrice] = useState(initialIsSamePrice);

  // Reset the same price state when the initial value changes
  useEffect(() => {
    setIsSamePrice(initialIsSamePrice);
  }, [initialIsSamePrice]);

  const onSamePricePress = useCallback(() => {
    let samePrice;

    setIsSamePrice((prev) => {
      samePrice = !prev;
      return !prev;
    });

    // If the price is the same, set the weekend price to the weekday price
    const newWeekendPrice = samePrice ? weekDayPrice : "";

    onWeekendPriceChange && onWeekendPriceChange(newWeekendPrice);
  }, [weekDayPrice, onWeekendPriceChange]);

  return (
    <>
      <FormInput
        type="currency"
        label={isSamePrice ? "Weekday/Weekend Price" : "Weekday Price"}
        placeholder={
          isSamePrice ? "Enter weekday/weekend price" : "Enter weekday price"
        }
        isNumberValue={false}
        maxLength={MAX_PRICE_LENGTH}
        value={weekDayPrice}
        onChangeText={(value) => {
          onWeekdayPriceChange && onWeekdayPriceChange(value);

          // If the price is the same, set the weekday price to the weekend price
          if (isSamePrice) {
            onWeekendPriceChange && onWeekendPriceChange(value);
          }
        }}
        onBlur={() => {
          let newPrice = Number(weekDayPrice);

          if (!checkIfValidPrice(newPrice)) {
            onWeekdayPriceChange && onWeekdayPriceChange("");
            return;
          }

          // If the price is valid, set the price to 2 decimal places
          newPrice = isNaN(newPrice) ? "" : newPrice.toFixed(2);

          // Set the weekday price to the new price
          onWeekdayPriceChange && onWeekdayPriceChange(newPrice);
        }}
        keyboardType="number-pad"
      />

      {!isSamePrice && (
        <FormInput
          type="currency"
          label="Weekend Price"
          placeholder={
            isSamePrice ? "Enter weekday/weekend price" : "Enter weekend price"
          }
          isNumberValue={false}
          maxLength={MAX_PRICE_LENGTH}
          value={weekendPrice}
          onChangeText={(value) => {
            onWeekendPriceChange && onWeekendPriceChange(value);
          }}
          onBlur={() => {
            let newPrice = Number(weekendPrice);

            if (!checkIfValidPrice(newPrice)) {
              onWeekendPriceChange && onWeekendPriceChange("");
              return;
            }

            // If the price is valid, set the price to 2 decimal places
            newPrice = isNaN(newPrice) ? "" : newPrice.toFixed(2);

            // Set the weekend price to the new price
            onWeekendPriceChange && onWeekendPriceChange(newPrice);
          }}
          keyboardType="number-pad"
        />
      )}

      <Pressable
        onPress={onSamePricePress}
        style={({ pressed }) => ({
          ...style.checkboxContainer,
          ...pressedOpacity(pressed),
        })}
      >
        <Checkbox
          value={isSamePrice}
          size={23}
          color={Colors.blue}
          style={style.checkbox}
        />
        <Text style={style.hint}>
          The price is {isSamePrice ? "the same" : "not the same"} for weekdays
          and weekends.
        </Text>
      </Pressable>
    </>
  );
};

export default memo(ListingPriceInput);
