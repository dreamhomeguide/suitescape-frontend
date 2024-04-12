import React, { memo, useCallback } from "react";
import { FlatList, Text, View } from "react-native";

import globalStyles from "../../assets/styles/globalStyles";
import style from "../../assets/styles/summaryStyles";

const SummaryListView = ({ label, data }) => {
  const renderItem = useCallback(
    ({ item, index }) => (
      <View key={index} style={style.detailsRow}>
        <Text style={style.detailsLabel}>{item.label}</Text>
        <Text style={style.detailsValue}>{item.value || "-"}</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={style.container}>
      <Text style={style.headerText}>{label}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.largeContainerGap}
        scrollEnabled={false}
      />
    </View>
  );
};

export default memo(SummaryListView);
