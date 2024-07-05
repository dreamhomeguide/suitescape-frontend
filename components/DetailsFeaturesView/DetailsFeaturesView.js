import React, { memo } from "react";
import { Text, View } from "react-native";

import style from "../../assets/styles/detailsStyles";
import ButtonLink from "../ButtonLink/ButtonLink";
import ListingFeaturesView, {
  FEATURES,
} from "../ListingFeaturesView/ListingFeaturesView";

const FEATURE_TITLE = {
  [FEATURES.amenities]: "Amenities",
  [FEATURES.placesNearby]: "Places Nearby",
};

const DetailsFeaturesView = ({
  feature,
  data,
  size,
  seeAllText = "See All",
}) => {
  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={style.subHeaderContainer}>
        <Text style={style.headerText}>{FEATURE_TITLE[feature]}</Text>
      </View>

      <ListingFeaturesView
        feature={feature}
        data={data}
        size={size}
        fullMode={false}
      />

      {data?.length > size && (
        <View style={style.bottomSeeAllContainer}>
          <ButtonLink textStyle={style.seeAllText}>{seeAllText}</ButtonLink>
        </View>
      )}
    </View>
  );
};

export default memo(DetailsFeaturesView);
