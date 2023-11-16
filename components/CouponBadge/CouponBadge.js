import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "./CouponBadgeStyles";

const CouponBadge = ({ children }) => {
  return (
    <View style={style.container}>
      <Text style={style.text}>{children}</Text>
    </View>
  );
};

export default memo(CouponBadge);
