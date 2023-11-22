import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

import style from "./OTPBoxesStyles";

const OTPBoxes = ({ size = 6, onOTPChange }) => {
  const [OTP, setOTP] = useState(Array(size).fill(""));
  const inputRefs = useRef(Array(size).fill(null));

  const updateOTP = (value, index) => {
    const newOTP = [...OTP];
    newOTP[index] = value;
    setOTP(newOTP);

    if (onOTPChange) {
      onOTPChange(newOTP.join(""));
    }
  };

  const onChangeText = (value, index) => {
    updateOTP(value, index);

    if (value && index < size - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const onKeyPress = (key, index) => {
    if (key === "Backspace" && !OTP[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const renderOTPBoxes = () => {
    const OTPInputs = [];

    for (let i = 0; i < size; i++) {
      OTPInputs.push(
        <TextInput
          key={i}
          ref={(ref) => (inputRefs.current[i] = ref)}
          maxLength={1}
          keyboardType="numeric"
          value={OTP[i]}
          onChangeText={(value) => onChangeText(value, i)}
          onKeyPress={({ nativeEvent: { key } }) => onKeyPress(key, i)}
          style={style.input({ hasValue: OTP[i] })}
        />,
      );
    }

    return OTPInputs;
  };

  return <View style={style.container}>{renderOTPBoxes()}</View>;
};

export default OTPBoxes;
