import React, { memo, useCallback } from "react";
import { FlatList, Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";

const DetailsPolicyView = ({
  bookingPolicies,
  cancellationPolicy,
  smallSpacing = false,
}) => {
  const renderItem = useCallback(
    ({ item: policy, index }) => (
      <Text key={index} style={style.emphasizedText}>
        {policy.name}
      </Text>
    ),
    [],
  );

  return (
    <View
      style={{
        ...style.container,
        ...(smallSpacing && { paddingHorizontal: 20 }),
      }}
    >
      <Text style={style.headerText}>Booking Policy</Text>

      <FlatList
        data={bookingPolicies}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={globalStyles.rowGap}
        ListFooterComponent={
          <Text style={style.emphasizedText}>{cancellationPolicy}</Text>
        }
      />
    </View>
  );
};

export default memo(DetailsPolicyView);
