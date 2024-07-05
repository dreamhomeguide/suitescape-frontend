import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import React, { forwardRef, memo, useCallback, useEffect } from "react";
import {
  NativeSyntheticEvent,
  Platform,
  TextInputFocusEventData,
} from "react-native";
import { TextFieldRef } from "react-native-ui-lib";

import FormInput, { FormInputProps } from "../FormInput/FormInput";

const FormInputSheet = forwardRef<TextFieldRef, FormInputProps>(
  ({ onFocus, onBlur, ...rest }: FormInputProps, ref) => {
    const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

    useEffect(() => {
      return () => {
        if (Platform.OS === "ios") {
          // Reset the flag on unmount
          shouldHandleKeyboardEvents.value = false;
        }
      };
    }, [shouldHandleKeyboardEvents]);

    const handleOnFocus = useCallback(
      (args?: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (Platform.OS === "ios") {
          shouldHandleKeyboardEvents.value = true;
        }
        if (onFocus) {
          onFocus(args);
        }
      },
      [onFocus, shouldHandleKeyboardEvents],
    );

    const handleOnBlur = useCallback(
      (args?: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (Platform.OS === "ios") {
          shouldHandleKeyboardEvents.value = false;
        }
        if (onBlur) {
          onBlur(args);
        }
      },
      [onBlur, shouldHandleKeyboardEvents],
    );

    return (
      <FormInput
        ref={ref}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...rest}
      />
    );
  },
);

export default memo(FormInputSheet);
