import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import ReadMore from "../ReadMore/ReadMore";

const DetailsDescriptionView = ({
  title = "Description",
  emptyText = "No description.",
  description,
}) => {
  return (
    <View style={style.container}>
      <Text style={style.headerText}>{title}</Text>

      {description ? (
        <ReadMore numberOfLines={4} textStyle={style.text}>
          {description}
        </ReadMore>
      ) : (
        <Text style={style.text}>{emptyText}</Text>
      )}
    </View>
  );
};

export default memo(DetailsDescriptionView);
