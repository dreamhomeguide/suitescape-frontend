import Ionicons from "@expo/vector-icons/Ionicons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import style from "./BottomSheetHeaderStyles";
import { Colors } from "../../assets/Colors";
import { pressedOpacity } from "../../assets/styles/globalStyles";

const BottomSheetHeader = ({ label, onClose, children }) => {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => pressedOpacity(pressed)}
        >
          <Ionicons name="chevron-back" size={30} color={Colors.black} />
        </Pressable>
        <View>{label && <Text style={style.headerLabel}>{label}</Text>}</View>
      </View>
      {children}
    </View>
  );
};

export default memo(BottomSheetHeader);
