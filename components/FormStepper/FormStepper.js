import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View } from "react-native";

import style from "./FormStepperStyles";
import globalStyles from "../../assets/styles/globalStyles";
import extractNumber from "../../utils/numberExtractor";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import DashView from "../DashView/DashView";
import FormInput from "../FormInput/FormInput";

const RESET_VALUE = -1;

const FormStepper = ({ placeholder, value, onValueChange }) => {
  return (
    <View style={style.mainContainer}>
      <FormInput
        placeholder={placeholder}
        keyboardType="number-pad"
        value={value === RESET_VALUE ? "" : value?.toString()}
        onChangeText={(input) =>
          extractNumber(input, (value) => {
            if (!value && value !== 0) {
              onValueChange && onValueChange(null);
              return;
            }
            onValueChange && onValueChange(value);
          })
        }
        disableAnimations
        useDefaultStyles={false}
        containerStyle={globalStyles.flexFull}
      />
      <View style={globalStyles.flexFull}>
        <View style={style.stepperContainer}>
          <ButtonIcon
            onPress={() => {
              if (value === 1) {
                onValueChange && onValueChange(RESET_VALUE);
                return;
              }
              onValueChange &&
                onValueChange(value >= 0 ? value - 1 : RESET_VALUE);
            }}
            renderIcon={() => (
              <Ionicons
                name="remove-outline"
                color="white"
                size={34}
                style={{ left: 1 }}
              />
            )}
          />
          <DashView />

          <ButtonIcon
            onPress={() =>
              onValueChange &&
              onValueChange(value === RESET_VALUE ? 1 : value + 1)
            }
            renderIcon={() => (
              <Ionicons
                name="add-outline"
                color="white"
                size={35}
                style={{ left: 1 }}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default FormStepper;
