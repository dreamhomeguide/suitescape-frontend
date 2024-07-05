import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "../../assets/Colors";
import style from "../../screens/PaymentMethod/PaymentMethodStyles";
import FormRadio from "../FormRadio/FormRadio";

const PaymentMethodItem = ({ item, isSelected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        ...style.paymentMethodContainer,
        borderColor: isSelected ? Colors.blue : Colors.lightgray,
      }}
    >
      <View style={style.paymentMethodContentContainer}>
        <View style={style.paymentMethodIconContainer}>{item.icon}</View>
        <Text style={style.text}>{item.label}</Text>
      </View>
      <View style={style.checkboxContainer}>
        <FormRadio selected={isSelected} />
      </View>
    </Pressable>
  );
};

export default memo(PaymentMethodItem);
