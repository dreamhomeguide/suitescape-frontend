import { useTheme } from "@react-navigation/native";
import { format, parse } from "date-fns";
import React, { useState, memo, forwardRef } from "react";
import { Keyboard, Platform, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { HelperText, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

import style from "./FormInputStyles";
import { Colors } from "../../assets/Colors";

const VALID_DATE = "yyyy-MM-dd";
const PARSE_FORMAT = "MMMM dd yyyy";

const FormInput = forwardRef(
  (
    {
      type = "text", // text, password, date
      value = null,
      onChangeText = null,
      onDateConfirm = null,
      placeholder = "",
      label = "",
      errorMessage = null,
      visible = false,
      onBlur,
      containerStyle,
      useDefaultStyles = true,
      disableAnimations = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showDatepicker, setShowDatepicker] = useState(false);

    const theme = useTheme();

    const inputTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        primary: Colors.blue,
        placeholder: Colors.blue,
        onSurfaceVariant: "gray",
        elevation: {
          level2: "white",
        },
      },
      roundness: 10,
      animation: {
        scale: disableAnimations ? 0.3 : 1,
      },
    };

    const handlePasswordPress = () => {
      setShowPassword((prev) => !prev);
    };

    const handleDatePress = () => {
      setShowDatepicker(true);
      Keyboard.dismiss();
    };

    const handleDateConfirm = (date) => {
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
        <HelperText key={index} type="error" visible={message}>
          {message}
        </HelperText>
      ));
    };

    if (type === "dropdown") {
      return (
        <View
          style={{
            ...(useDefaultStyles && style.inputContainer),
            ...containerStyle,
          }}
        >
          <DropDown
            ref={ref}
            theme={inputTheme}
            mode="outlined"
            value={value}
            placeholder={placeholder}
            label={label}
            visible={visible}
            inputProps={{
              outlineColor: errorMessage ? "red" : null,
              outlineStyle: value && style.border,
              right: (
                <TextInput.Icon
                  icon={visible ? "chevron-up" : "chevron-down"}
                />
              ),
            }}
            {...props}
          />
          {renderErrorMessages()}
        </View>
      );
    }

    return (
      <>
        <View
          style={{
            ...(useDefaultStyles && style.inputContainer),
            ...containerStyle,
            ...(errorMessage && { marginBottom: 4 }),
          }}
        >
          {label && <Text style={style.label}>{label}</Text>}
          <TextInput
            ref={ref}
            theme={inputTheme}
            mode="outlined"
            value={value}
            onChangeText={onChangeText}
            label={placeholder}
            secureTextEntry={type === "password" && !showPassword}
            outlineColor={errorMessage ? "red" : null}
            outlineStyle={value && style.border}
            textColor={theme.colors.text}
            multiline={type === "textarea"}
            style={{ textAlign: "auto" }}
            contentStyle={type === "textarea" && style.textArea}
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
            right={
              (type === "password" || type === "date") && (
                <TextInput.Icon
                  icon={
                    type === "password"
                      ? showPassword
                        ? "eye"
                        : "eye-off"
                      : type === "date" && "calendar"
                  }
                  color={inputTheme.colors.primary}
                  onPress={
                    type === "password" ? handlePasswordPress : handleDatePress
                  }
                />
              )
            }
            {...props}
          />
          {renderErrorMessages()}
        </View>
        {type === "date" && showDatepicker && (
          <DateTimePickerModal
            mode="date"
            themeVariant="light"
            maximumDate={new Date()}
            isVisible={showDatepicker}
            onCancel={() => setShowDatepicker(false)}
            onConfirm={handleDateConfirm}
            date={
              value && !isNaN(Date.parse(value)) ? new Date(value) : new Date()
            }
            display={Platform.OS === "ios" ? "inline" : "default"}
          />
        )}
      </>
    );
  },
);

export default memo(FormInput);
