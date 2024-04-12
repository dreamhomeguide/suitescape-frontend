import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FlatList, Keyboard, TextInput } from "react-native";

import style from "./OTPBoxesStyles";

const OTPBoxes = forwardRef(
  ({ size = 6, onOTPChange, onFinish, isInvalid }, ref) => {
    const [OTP, setOTP] = useState(Array(size).fill(""));
    const [focusedInput, setFocusedInput] = useState(0);

    const inputRefs = useRef(Array(size).fill(null));
    const prevTime = useRef(0);

    // Move focus to first input when OTP is cleared
    useEffect(() => {
      if (OTP.every((val) => val === "")) {
        inputRefs.current[0].focus();
        setFocusedInput(0);
      }
    }, [OTP]);

    const clear = useCallback(() => {
      setOTP(Array(size).fill(""));
    }, [size]);

    useImperativeHandle(ref, () => ({ clear }));

    const updateOTP = useCallback(
      (value, index) => {
        const newOTP = [...OTP];
        newOTP[index] = value;
        setOTP(newOTP);

        // Convert OTP to single string
        if (onOTPChange) {
          onOTPChange(newOTP.join(""));
        }

        // Call onFinish when OTP is filled
        if (
          onFinish &&
          !isInvalid &&
          index === size - 1 &&
          newOTP.every((val) => val)
        ) {
          onFinish(newOTP.join(""));
          Keyboard.dismiss();
        }
      },
      [isInvalid, onFinish, onOTPChange, OTP, size],
    );

    const onKeyPress = useCallback(
      (key, timeStamp, index) => {
        if (key === "Backspace") {
          // Return if duration between previous key press and backspace is less than 500ms
          if (Math.abs(prevTime.current - timeStamp) < 300) {
            return;
          }

          if (OTP[index]) {
            // Clear current input if it has value
            updateOTP("", index);
          } else if (index > 0) {
            // Focus previous input if current input is empty
            inputRefs.current[index - 1].focus();
          }

          return;
        }

        // Record non-backspace key event time stamp
        prevTime.current = timeStamp;

        // Update OTP value
        updateOTP(key, index);

        // Focus next input on number input
        if (index < size - 1) {
          inputRefs.current[index + 1].focus();
        }
      },
      [OTP, size, updateOTP],
    );

    const renderItem = useCallback(
      ({ item, index }) => (
        <TextInput
          autoFocus={index === 0}
          ref={(ref) => (inputRefs.current[index] = ref)}
          maxLength={1}
          keyboardType="numeric"
          value={item}
          onFocus={() => setFocusedInput(index)}
          onKeyPress={({ nativeEvent: { key }, timeStamp }) =>
            onKeyPress(key, timeStamp, index)
          }
          style={style.input({
            hasValue: item,
            isFocused: focusedInput === index,
            isInvalid,
          })}
        />
      ),
      [focusedInput, isInvalid, onKeyPress],
    );

    return (
      <FlatList
        data={OTP}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.contentContainer}
        style={style.mainContainer}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
    );
  },
);

export default memo(OTPBoxes);
