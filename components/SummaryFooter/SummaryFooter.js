import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/summaryStyles";

const SummaryFooter = ({ label, value }) => {
  return (
    <View style={style.container}>
      <View style={style.detailsRow}>
        <Text style={style.largeHeaderText}>{label}</Text>
        <Text style={style.largeHeaderText}>{value}</Text>
      </View>
    </View>
  );
};

export default memo(SummaryFooter);
