import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./PasswordCriteriaRowStyles";
import { Colors } from "../../assets/Colors";

const PasswordCriteriaRow = ({ met, text }) => {
  return (
    <View style={style.container}>
      <Ionicons
        name={met ? "checkmark" : "alert-circle"}
        size={15}
        color={met ? Colors.green : Colors.red}
      />
      <View style={style.textContainer}>
        <Text
          style={{
            ...style.text,
            ...{ color: met ? Colors.green : Colors.red },
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default memo(PasswordCriteriaRow);
