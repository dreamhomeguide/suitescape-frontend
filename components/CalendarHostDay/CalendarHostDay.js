import React, { memo } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import style from "./CalendarHostDayStyles";
import globalStyles from "../../assets/styles/globalStyles";

const CalendarHostDay = ({
  date,
  state,
  marking,
  price,
  onDayPress,
  isSpecialRate,
}) => {
  return (
    <View style={style.container(marking)}>
      <TouchableOpacity
        onPress={() => onDayPress(date)}
        style={globalStyles.textGap}
      >
        <Text style={style.label(state, marking)}>{date.day}</Text>

        <Text numberOfLines={1} style={style.price(isSpecialRate)}>
          ₱{price.toLocaleString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(CalendarHostDay);
