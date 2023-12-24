import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Checkbox } from "react-native-ui-lib";

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
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const onOptionPress = (option) => {
    if (multiSelect && value) {
      if (value.includes(option)) {
        onSelected(value.filter((item) => item !== option));
      } else {
        onSelected([...value, option]);
      }
    } else {
      onSelected(option === value ? null : option);
    }
  };

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
  }, [value]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <RectButton
          onPress={() => onOptionPress(item.value)}
          style={{
            height: 50,
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            ...globalStyles.bottomGapSmall,
          }}
          // activeOpacity={0.1}
        >
          <Text style={{ color: "black", fontSize: 15 }}>{item.label}</Text>
          <View pointerEvents="none">
            {multiSelect ? (
              <Checkbox
                value={value?.includes(item.value)}
                color={Colors.blue}
                style={{ borderColor: "gray" }}
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
        onPress={() => setPickerVisible(true)}
        style={({ pressed }) => ({ flex: 1, ...pressedOpacity(pressed) })}
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

      <BottomSheet
        visible={pickerVisible}
        onDismiss={() => setPickerVisible(false)}
        style={{ paddingTop: 10 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            columnGap: 2,
            left: -10,
          }}
        >
          <Pressable
            onPress={() => setPickerVisible(false)}
            style={({ pressed }) => pressedOpacity(pressed)}
          >
            <Ionicons name="chevron-back" size={30} color={Colors.black} />
          </Pressable>
          <View>
            {label && (
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{label}</Text>
            )}
          </View>
        </View>

        <BottomSheetFlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ rowGap: 3, paddingVertical: 15 }}
          contentInset={{ bottom: insets.bottom }}
          renderItem={renderItem}
        />
      </BottomSheet>
    </>
  );
};

export default memo(FormPicker);
