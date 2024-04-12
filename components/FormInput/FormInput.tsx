import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React, {
  useState,
  memo,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  Keyboard,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Masks, useMaskedInputProps } from "react-native-mask-input";
import DateTimePickerModal, {
  DateTimePickerProps,
} from "react-native-modal-datetime-picker";
import { TextField, TextFieldProps, TextFieldRef } from "react-native-ui-lib";

import style from "./FormInputStyles";
import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";
import convertDateFormat from "../../utils/dateConverter";
import ButtonLink from "../ButtonLink/ButtonLink";

// If you're going to change this, change also the maskedDateProps
export const VALID_INPUT_DATE = "MM/dd/yyyy";

type FormInputProps = TextFieldProps & {
  type?: "text" | "password" | "date" | "textarea" | "editable" | "clearable";
  value?: string;
  onChangeText?: (text: string) => void;
  onDateConfirm?: (date: Date, text: string) => void;
  onEditPressed?: () => void;
  onEditDone?: () => void;
  onClear?: () => void;
  onChangePasswordVisibility?: () => void;
  isPasswordVisible?: boolean;
  errorMessage?: string[];
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  trailingAccessory?: React.ReactNode;
  dateProps?: DateTimePickerProps;
};

const FormInput = forwardRef<TextFieldRef, FormInputProps>(
  (
    {
      type = "text",
      value = null,
      onChangeText = null,
      onDateConfirm = null,
      onEditPressed = null,
      onEditDone = null,
      onClear = null,
      onChangePasswordVisibility = null,
      isPasswordVisible = false,
      errorMessage = null,
      label = "",
      labelStyle,
      containerStyle,
      trailingAccessory,
      dateProps,
      ...props
    },
    ref,
  ) => {
    const [editable, setEditable] = useState(type !== "editable");
    const [showPassword, setShowPassword] = useState(false);
    const [showDatepicker, setShowDatepicker] = useState(false);

    const inputRef = useRef<TextFieldRef>();

    useImperativeHandle(ref, () => inputRef.current);

    const handlePasswordPress = () => {
      setShowPassword((prev) => !prev);
    };

    const handleDatePress = () => {
      setShowDatepicker(true);
      Keyboard.dismiss();
    };

    const handleDateConfirm = (date: Date) => {
      // Clears minutes, seconds, and milliseconds
      const timeResetDate = new Date(date.toISOString().split("T")[0]);

      if (onDateConfirm) {
        onDateConfirm(timeResetDate, format(date, VALID_INPUT_DATE));
      }

      // const confirmed = onDateConfirm && onDateConfirm(date);
      // if (confirmed !== false || !onDateConfirm) {
      //   onChangeText(format(date, VALID_DATE));
      // }

      setShowDatepicker(false);
    };

    const renderErrorMessages = () => {
      if (!errorMessage) {
        return null;
      }

      if (!Array.isArray(errorMessage)) {
        console.log("Error message is not an array", errorMessage);
        return null;
      }

      // Note: Each error message is an array
      return errorMessage.map((message, index) => (
        <Text key={index} style={style.error}>
          {message}
        </Text>
      ));
    };

    const renderTrailingAccessory = () => {
      const accessoryTypes = {
        // error: () => (
        //   <Ionicons name="alert-circle" color={Colors.red} size={18} />
        // ),
        password: () =>
          value && (
            <RectButton
              style={style.trailingIcon}
              onPress={onChangePasswordVisibility ?? handlePasswordPress}
            >
              <Ionicons
                name={isPasswordVisible || showPassword ? "eye" : "eye-off"}
                color={Colors.blue}
                size={20}
              />
            </RectButton>
          ),
        date: () => (
          <RectButton style={style.trailingIcon} onPress={handleDatePress}>
            <Ionicons name="calendar" color={Colors.blue} size={20} />
          </RectButton>
        ),
        editable: () => (
          <ButtonLink
            textStyle={style.trailingLabel}
            onPress={() => {
              setEditable((prev) => !prev);

              if (editable) {
                onEditDone && onEditDone();
              } else {
                onEditPressed && onEditPressed();
              }
            }}
            containerStyle={style.trailingIcon}
          >
            {editable ? "Done" : "Edit"}
          </ButtonLink>
        ),
        clearable: () =>
          value ? (
            <Pressable
              style={({ pressed }) => ({
                ...pressedOpacity(pressed),
                ...style.trailingIcon,
              })}
              onPress={onClear}
            >
              <Ionicons name="close-circle" size={20} color="gray" />
            </Pressable>
          ) : null,
        // default: () =>
        //   trailingAccessory && (
        //     <View style={style.trailingIcon}>{trailingAccessory}</View>
        //   ),
      };

      // Get the function for the current accessory type
      // const accessoryFunction = accessoryTypes[errorMessage ? "error" : type];
      const accessoryFunction = accessoryTypes[type];

      // If the function exists, call it. Otherwise, call the default function
      return accessoryFunction ? accessoryFunction() : trailingAccessory;
    };

    const maskedDateProps = useMaskedInputProps({
      value: value ?? "",
      onChangeText,
      mask: Masks.DATE_MMDDYYYY,
    });

    return (
      <>
        <Pressable
          onPress={() => inputRef.current.focus()}
          style={containerStyle}
        >
          {label && <Text style={[style.label, labelStyle]}>{label}</Text>}
          <TextField
            ref={inputRef}
            value={type === "date" ? maskedDateProps.value : value}
            onChangeText={
              type === "date" ? maskedDateProps.onChangeText : onChangeText
            }
            editable={editable}
            cursorColor={Colors.blue}
            textAlignVertical="top"
            secureTextEntry={
              type === "password" && !(showPassword || isPasswordVisible)
            }
            multiline={type === "textarea"}
            containerStyle={{ height: type === "textarea" ? 150 : 60 }}
            fieldStyle={style.field}
            dynamicFieldStyle={({ isFocused, hasValue }) => ({
              borderWidth: isFocused || hasValue ? 1.2 : 1,
              borderColor: isFocused ? Colors.blue : Colors.gray,

              ...(errorMessage && { borderColor: Colors.red }),

              // Adds padding to the right of the input field
              ...((!type.match("text") || trailingAccessory) &&
                !errorMessage && {
                  paddingRight: 50,
                }),
              ...(type === "editable" &&
                editable && {
                  paddingRight: 65,
                }),
            })}
            trailingAccessory={renderTrailingAccessory()}
            {...props}
          />
          {renderErrorMessages()}
        </Pressable>

        {type === "date" && showDatepicker && (
          <DateTimePickerModal
            mode="date"
            themeVariant="light"
            isVisible={showDatepicker}
            date={new Date(convertDateFormat(value))}
            onConfirm={handleDateConfirm}
            onCancel={() => setShowDatepicker(false)}
            display="spinner"
            {...dateProps}
          />
        )}
      </>
    );
  },
);

export default memo(FormInput);
