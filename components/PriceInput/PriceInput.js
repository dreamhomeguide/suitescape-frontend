import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, View } from "react-native";
import { TextField } from "react-native-ui-lib";

import style from "./PriceInputStyles";
import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import checkIfValidPrice, {
  MAX_PRICE_LENGTH,
} from "../../utils/priceValidator";

const PriceInput = ({
  price,
  onPriceChange,
  defaultPrice,
  isEditable,
  onEditableChange,
}) => {
  return (
    <View style={style.mainContainer}>
      <TextField
        editable={isEditable}
        value={`₱${price.toLocaleString()}`}
        onChangeText={(text) =>
          onPriceChange && onPriceChange(text.replace("₱", ""))
        }
        onBlur={() => {
          const newPrice =
            typeof price === "string" ? Number(price.replace(/,/g, "")) : price;

          if (!checkIfValidPrice(newPrice)) {
            onPriceChange(defaultPrice);
            return;
          }

          // Set the weekday price to the new price
          onPriceChange(newPrice);
        }}
        maxLength={MAX_PRICE_LENGTH}
        keyboardType="number-pad"
        style={style.text}
      />

      <Pressable
        onPress={() => onEditableChange && onEditableChange(!isEditable)}
        style={({ pressed }) => pressedOpacity(pressed)}
      >
        {isEditable ? (
          <View style={style.iconContainer}>
            <MaterialCommunityIcons
              name="check"
              size={25}
              color={Colors.green}
            />
          </View>
        ) : (
          <MaterialCommunityIcons
            name="pencil"
            size={22}
            color={Colors.black}
          />
        )}
      </Pressable>
    </View>
  );
};

export default memo(PriceInput);
