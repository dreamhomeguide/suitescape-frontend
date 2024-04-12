import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import ButtonLink from "../ButtonLink/ButtonLink";
import ListingFeaturesView from "../ListingFeaturesView/ListingFeaturesView";

const DetailsFeaturesView = ({
  feature,
  data,
  size,
  seeAllText = "See All",
}) => {
  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={style.subHeaderContainer}>
        <Text style={style.headerText}>Places Nearby</Text>
      </View>

      <ListingFeaturesView feature={feature} data={data} size={size} />

      {data?.length > size && (
        <View style={style.bottomSeeAllContainer}>
          <ButtonLink textStyle={style.seeAllText}>{seeAllText}</ButtonLink>
        </View>
      )}
    </View>
  );
};

export default memo(DetailsFeaturesView);
