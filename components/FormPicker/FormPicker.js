import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Checkbox } from "react-native-ui-lib";

import style from "./FormPickerStyles";
import { Colors } from "../../assets/Colors";
import globalStyles, { pressedOpacity } from "../../assets/styles/globalStyles";
import BottomSheet from "../BottomSheet/BottomSheet";
import FormInput from "../FormInput/FormInput";
import formInputStyles from "../FormInput/FormInputStyles";
import FormRadio from "../FormRadio/FormRadio";

const FormPicker = ({
  label,
  data,
  value,
  onSelected,
  multiSelect,
  errorMessage,
  disabled,
  onPressDisabled,
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const onOptionPress = useCallback(
    (option) => {
      if (multiSelect && value) {
        if (value.includes(option)) {
          onSelected(value.filter((item) => item !== option));
        } else {
          onSelected([...value, option]);
        }
      } else {
        onSelected(option === value ? null : option);
      }
    },
    [multiSelect, onSelected, value],
  );

  const inputValue = useMemo(() => {
    let result;

    if (multiSelect) {
      result = data
        .filter((item) => value?.includes(item.value))
        .map((item) => item.label)
        .join(", ");
    } else {
      result = data?.find((item) => item.value === value)?.label;
    }

    return result;
  }, [data, value]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <RectButton
          onPress={() => onOptionPress(item.value)}
          style={style.row}
          // activeOpacity={0.1}
        >
          <Text style={style.label}>{item.label}</Text>
          <View pointerEvents="none">
            {multiSelect ? (
              <Checkbox
                value={value?.includes(item.value)}
                color={Colors.blue}
                style={style.checkbox}
              />
            ) : (
              <FormRadio selected={value === item.value} />
            )}
          </View>
        </RectButton>
      );
    },
    [value],
  );

  return (
    <>
      <Pressable
        onPress={() => {
          if (disabled) {
            onPressDisabled();
          } else {
            setPickerVisible(true);
          }
        }}
        style={({ pressed }) => ({
          ...globalStyles.flexFull,
          ...pressedOpacity(pressed),
        })}
      >
        <View pointerEvents="none">
          <FormInput
            placeholder={label}
            // value={multiSelect ? value?.join(", ") : value}
            value={inputValue}
            onChangeText={(destination) => onSelected(destination)}
            errorMessage={errorMessage}
            useDefaultStyles={false}
            trailingAccessory={
              <View style={formInputStyles.trailingIcon}>
                <Ionicons name="chevron-down" color="black" size={20} />
              </View>
            }
          />
        </View>
      </Pressable>

      {pickerVisible && (
        <BottomSheet
          visible={pickerVisible}
          onDismiss={() => setPickerVisible(false)}
          style={style.bottomSheet}
        >
          <View style={style.header}>
            <Pressable
              onPress={() => setPickerVisible(false)}
              style={({ pressed }) => pressedOpacity(pressed)}
            >
              <Ionicons name="chevron-back" size={30} color={Colors.black} />
            </Pressable>
            <View>
              {label && <Text style={style.headerLabel}>{label}</Text>}
            </View>
          </View>

          <BottomSheetFlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              ...style.flatList,
              ...globalStyles.rowGap,
            }}
            contentInset={{ bottom: insets.bottom }}
            renderItem={renderItem}
          />
        </BottomSheet>
      )}
    </>
  );
};

export default memo(FormPicker);
