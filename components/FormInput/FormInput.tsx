import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import React, {
  useState,
  memo,
  forwardRef,
  useRef,
  useImperativeHandle,
  ReactNode,
  ReactElement,
  useMemo,
  useCallback,
} from "react";
import {
  Keyboard,
  LogBox,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
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
import { isEmptyField } from "../../utils/emptyFieldChecker";
import extractNumber from "../../utils/numberExtractor";
import ButtonLink from "../ButtonLink/ButtonLink";

// Workaround until DateTimePickerModal is updated to fix this
LogBox.ignoreLogs([
  "Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.",
]);

// If you're going to change this, change also the maskedDateProps
export const VALID_INPUT_DATE = "MM/dd/yyyy";
export const VALID_INPUT_TIME = "h:mm a";

export type FormInputProps = TextFieldProps & {
  type?:
    | "text"
    | "password"
    | "date"
    | "time"
    | "number"
    | "currency"
    | "textarea"
    | "editable"
    | "clearable";
  value?: string;
  onChangeText?: (text: string) => void;
  onDateConfirm?: (date: Date, text: string) => void;
  onEditPressed?: () => void;
  onEditDone?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangePasswordVisibility?: () => void;
  isPasswordVisible?: boolean;
  isNumberValue?: boolean;
  bordersEnabled?: boolean;
  inputEnabled?: boolean;
  useDefaultHeight?: boolean;
  useDefaultStyle?: boolean;
  errorMessage?: string[];
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  trailingAccessory?: React.ReactNode;
  dateProps?: DateTimePickerProps;
};

const FormInput = forwardRef<TextFieldRef, FormInputProps>(
  (
    {
      type = "text",
      value = null,
      defaultValue = null,
      onChangeText = null,
      onDateConfirm = null,
      onEditPressed = null,
      onEditDone = null,
      onClear = null,
      onFocus = null,
      onBlur = null,
      onChangePasswordVisibility = null,
      isPasswordVisible = false,
      isNumberValue = true,
      bordersEnabled = true,
      inputEnabled = true,
      useDefaultHeight = true,
      useDefaultStyle = true,
      errorMessage = null,
      label = "",
      labelStyle,
      fieldStyle,
      containerStyle,
      leadingAccessory,
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
      // let newDate = date;
      // if (type === "date") {
      //   newDate = new Date(date.toISOString().split("T")[0]);
      // }

      if (onDateConfirm) {
        onDateConfirm(
          date,
          format(date, type === "date" ? VALID_INPUT_DATE : VALID_INPUT_TIME),
        );
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

    const leadingAccessoryTypes = {
      search: () => (
        <View style={style.leadingIcon}>
          <Ionicons name="search" size={20} />
        </View>
      ),
    };

    const trailingAccessoryTypes = {
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
      time: () => (
        <RectButton style={style.trailingIcon} onPress={handleDatePress}>
          <Ionicons name="time" color={Colors.blue} size={22} />
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

    const renderAccessory = (
      accessoryTypes: { [key: string]: () => ReactNode },
      defaultAccessory: ReactNode,
    ): ReactNode => {
      // Get the function for the current accessory type
      // const accessoryFunction = accessoryTypes[errorMessage ? "error" : type];
      const accessoryFunction = accessoryTypes[type];

      // If the function exists, call it. Otherwise, call the default function
      return accessoryFunction ? accessoryFunction() : defaultAccessory;
    };

    const maskedDateProps = useMaskedInputProps(
      type === "date" && {
        value: value ?? "",
        onChangeText,
        mask: Masks.DATE_MMDDYYYY,
      },
    );

    const numberProps = useMemo(() => {
      if (type !== "number" && type !== "currency") {
        return;
      }

      // Formats the value to have commas
      // const localeValue = isNaN(Number(value))
      //   ? value
      //   : Number(value).toLocaleString();

      // Adds the currency symbol to the value
      const newValue = type === "currency" ? `₱${value}` : `${value}`;

      return {
        value: isEmptyField(value) ? "" : newValue,
        onChangeText: (text: string) => {
          // Removes the currency symbol before extracting the number
          const transformedText =
            type === "currency" ? text.replace("₱", "") : text;

          extractNumber(
            transformedText,
            isNumberValue,
            (numberValue: string) => {
              return onChangeText(numberValue);
            },
          );
        },
      };
    }, [isNumberValue, onChangeText, type, value]);

    const fieldValue = useMemo(() => {
      // Workaround for multiline input looping
      if (type === "textarea") {
        return null;
      }

      if (type === "date") {
        return maskedDateProps.value;
      }

      if (type === "number" || type === "currency") {
        return numberProps.value;
      }

      return value;
    }, [maskedDateProps?.value, numberProps?.value, type, value]);

    const fieldOnChangeText = useMemo(() => {
      if (type === "date") {
        return maskedDateProps.onChangeText;
      }

      if (type === "number" || type === "currency") {
        return numberProps.onChangeText;
      }

      return onChangeText;
    }, [
      maskedDateProps?.onChangeText,
      numberProps?.onChangeText,
      type,
      onChangeText,
    ]);

    const dynamicFieldStyle = useCallback(
      ({ isFocused, hasValue }) => ({
        ...(bordersEnabled && {
          borderWidth: isFocused || hasValue ? 1.2 : 1,
          borderColor: isFocused ? Colors.blue : Colors.gray,
        }),

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
      }),
      [bordersEnabled, editable, errorMessage, trailingAccessory, type],
    );

    return (
      <>
        <Pressable
          onPress={() => {
            if (type === "time" || !inputEnabled) {
              handleDatePress();
              return;
            }

            inputRef.current.focus();
          }}
          style={containerStyle}
        >
          {label && <Text style={[style.label, labelStyle]}>{label}</Text>}
          <TextField
            ref={inputRef}
            value={fieldValue}
            // Workaround for looping onChangeText for multiline=true
            defaultValue={type === "textarea" ? value : defaultValue}
            onChangeText={fieldOnChangeText}
            onFocus={() => {
              if (type === "time" || !inputEnabled) {
                handleDatePress();
                return;
              }

              if (onFocus) {
                onFocus();
              }
            }}
            onBlur={onBlur}
            editable={editable}
            cursorColor={Colors.blue}
            textAlignVertical="top"
            secureTextEntry={
              type === "password" && !(showPassword || isPasswordVisible)
            }
            multiline={type === "textarea"}
            containerStyle={
              useDefaultHeight && {
                height: type === "textarea" ? 150 : 60,
              }
            }
            fieldStyle={[useDefaultStyle && style.field, fieldStyle]}
            dynamicFieldStyle={dynamicFieldStyle}
            leadingAccessory={
              renderAccessory(
                leadingAccessoryTypes,
                leadingAccessory,
              ) as ReactElement
            }
            trailingAccessory={
              renderAccessory(
                trailingAccessoryTypes,
                trailingAccessory,
              ) as ReactElement
            }
            {...props}
          />
          {renderErrorMessages()}
        </Pressable>

        {(type === "date" || type === "time") && showDatepicker && (
          <DateTimePickerModal
            mode={type}
            themeVariant="light"
            isVisible={showDatepicker}
            is24Hour={false}
            date={
              new Date(
                convertDateFormat(
                  value,
                  "datetime",
                  type === "date" ? VALID_INPUT_DATE : VALID_INPUT_TIME,
                ),
              )
            }
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
