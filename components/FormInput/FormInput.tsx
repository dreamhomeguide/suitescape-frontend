import Ionicons from "@expo/vector-icons/Ionicons";
import { format, parse } from "date-fns";
import React, {
  useState,
  memo,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import DateTimePickerModal, {
  DateTimePickerProps,
} from "react-native-modal-datetime-picker";
import { TextField, TextFieldProps, TextFieldRef } from "react-native-ui-lib";

import style from "./FormInputStyles";
import { Colors } from "../../assets/Colors";
import ButtonLink from "../ButtonLink/ButtonLink";

const VALID_DATE = "yyyy-MM-dd";
const PARSE_FORMAT = "MMMM dd yyyy";

type FormInputProps = TextFieldProps & {
  type?: "text" | "password" | "date" | "textarea" | "editable";
  value?: string;
  onChangeText?: (text: string) => void;
  onDateConfirm?: (date: Date) => boolean | void;
  onEditPressed?: () => void;
  onEditDone?: () => void;
  label?: string;
  errorMessage?: string[];
  onBlur?: (date?: Date) => void;
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
      label = "",
      errorMessage = null,
      onBlur,
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
      if (!onChangeText) {
        console.log("onChangeText is not defined");
        return;
      }

      const confirmed = onDateConfirm && onDateConfirm(date);

      if (confirmed !== false || !onDateConfirm) {
        onChangeText(date.toISOString().split("T")[0]);
      }
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
              onPress={handlePasswordPress}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
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
        default: () =>
          trailingAccessory && (
            <View style={style.trailingIcon}>{trailingAccessory}</View>
          ),
      };

      // Get the function for the current accessory type
      // const accessoryFunction = accessoryTypes[errorMessage ? "error" : type];
      const accessoryFunction = accessoryTypes[type];

      // If the function exists, call it. Otherwise, call the default function
      return accessoryFunction ? accessoryFunction() : accessoryTypes.default();
    };

    return (
      <>
        <Pressable
          onPress={() => inputRef.current.focus()}
          style={containerStyle}
        >
          {label && <Text style={style.label}>{label}</Text>}
          <TextField
            // @ts-expect-error
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            cursorColor={Colors.blue}
            textAlignVertical="top"
            secureTextEntry={type === "password" && !showPassword}
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
            onBlur={() => {
              // The code after this only applies to date type
              if (type !== "date" || !value) {
                onBlur && onBlur();
                return;
              }

              // If the date is already valid, do nothing
              const validDate = parse(value, VALID_DATE, new Date());
              if (!isNaN(validDate.getDate())) {
                onBlur && onBlur(validDate);
                return;
              }

              // If the date is invalid, try to parse it
              const parsedDate = parse(
                value.replaceAll(",", ""),
                PARSE_FORMAT,
                new Date(),
              );

              if (parsedDate && onChangeText) {
                onChangeText(
                  isNaN(parsedDate.getDate())
                    ? ""
                    : format(parsedDate, "yyyy-MM-dd"),
                );
              }
              onBlur && onBlur(parsedDate);
            }}
            {...props}
          />
          {renderErrorMessages()}
        </Pressable>

        {type === "date" && showDatepicker && (
          <DateTimePickerModal
            mode="date"
            themeVariant="light"
            isVisible={showDatepicker}
            date={
              value && !isNaN(Date.parse(value)) ? new Date(value) : new Date()
            }
            onConfirm={handleDateConfirm}
            onCancel={() => setShowDatepicker(false)}
            display={Platform.OS === "ios" ? "inline" : "default"}
            {...dateProps}
          />
        )}
      </>
    );
  },
);

export default memo(FormInput);
