import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";

import style from "./StepperStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonIcon from "../ButtonIcon/ButtonIcon";

const Stepper = ({
  value = 0,
  maxValue,
  minValue,
  onValueChange,
  containerStyle,
}) => {
  const onIncrement = useCallback(() => {
    if (maxValue == null || value < maxValue) {
      onValueChange(value + 1);
    }
  }, [maxValue, value]);

  const onDecrement = useCallback(() => {
    if (minValue == null || value > minValue) {
      onValueChange(value - 1);
    }
  }, [minValue, value]);

  return (
    <View style={{ ...style.container, ...containerStyle }}>
      <ButtonIcon
        renderIcon={(pressed) => (
          <View style={globalStyles.flexCenter}>
            <Ionicons
              name="remove"
              size={24}
              color={pressed ? "white" : "black"}
            />
          </View>
        )}
        onPress={onDecrement}
        disabled={minValue != null && value <= minValue}
      />

      <Text>{value}</Text>

      <ButtonIcon
        renderIcon={(pressed) => (
          <View style={globalStyles.flexCenter}>
            <Ionicons
              name="add"
              size={24}
              color={pressed ? "white" : "black"}
            />
          </View>
        )}
        onPress={onIncrement}
        disabled={maxValue != null && value >= maxValue}
      />
    </View>
  );
};

export default memo(Stepper);
