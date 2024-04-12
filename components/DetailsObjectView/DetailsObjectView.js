import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";

const DetailsObjectView = ({ title, object }) => {
  const renderObjectAsList = useCallback(() => {
    if (object) {
      const entries = Object.entries(object);

      if (entries.length <= 0) {
        return <Text style={style.text}>No data available.</Text>;
      }

      return Object.entries(object).map(([key, value], index) => (
        <Text key={index} style={style.text}>
          {value} {key}
        </Text>
      ));
    } else {
      return <Text style={style.text}>Loading...</Text>;
    }
  }, [object]);

  return (
    <View style={style.container}>
      <Text style={style.headerText}>{title}</Text>

      <View style={globalStyles.textGap}>{renderObjectAsList()}</View>
    </View>
  );
};

export default memo(DetailsObjectView);
