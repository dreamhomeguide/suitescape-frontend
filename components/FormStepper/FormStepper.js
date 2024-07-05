import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo } from "react";
import { View } from "react-native";

import style from "./FormStepperStyles";
import globalStyles from "../../assets/styles/globalStyles";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import DashView from "../DashView/DashView";
import FormInput from "../FormInput/FormInput";
import FormInputSheet from "../FormInputSheet/FormInputSheet";

const RESET_VALUE = -1;

const FormStepper = ({
  label,
  value,
  onValueChange,
  useFormInputSheet,
  ...props
}) => {
  const FormInputComponent = useMemo(
    () => (useFormInputSheet ? FormInputSheet : FormInput),
    [useFormInputSheet],
  );

  return (
    <View style={style.mainContainer}>
      <FormInputComponent
        type="number"
        label={label}
        keyboardType="number-pad"
        value={value}
        onChangeText={(value) => onValueChange && onValueChange(value)}
        containerStyle={globalStyles.flexFull}
        {...props}
      />

      <View style={style.stepperContainer(label)}>
        <View style={style.contentContainer}>
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
