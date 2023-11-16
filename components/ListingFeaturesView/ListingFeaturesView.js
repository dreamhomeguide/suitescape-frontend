import React, { memo, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import style from "./ListingFeaturesViewStyles";
import globalStyles from "../../assets/styles/globalStyles";
import amenitiesData from "../../data/amenitiesData";
import placesNearbyData from "../../data/placesNearbyData";
import ListingFeatureItem from "../ListingFeatureItem/ListingFeatureItem";

export const FEATURES = {
  amenities: "amenities",
  placesNearby: "places nearby",
};

const featureData = {
  [FEATURES.amenities]: amenitiesData,
  [FEATURES.placesNearby]: placesNearbyData,
};

const ListingFeaturesView = ({ feature, data, size = 5, fullMode = false }) => {
  const [validFeatures, setValidFeatures] = useState([]);

  const getValidFeatures = () => {
    if (!data) {
      return [];
    }
    const validator = featureData[feature];
    return data.filter(({ name }) => validator[name]);
  };

  useEffect(() => {
    setValidFeatures(getValidFeatures());
  }, [data]);

  if (!data || !validFeatures || validFeatures.length === 0) {
    return <Text style={globalStyles.emptyText}>No {feature}.</Text>;
  }

  const validFeaturesData = fullMode
    ? validFeatures
    : validFeatures.slice(0, size);

  return (
    <View style={style.container}>
      <FlatList
        scrollEnabled={fullMode}
        data={validFeaturesData}
        numColumns={3}
        contentContainerStyle={style.contentContainer}
        renderItem={({ item }) => (
          <ListingFeatureItem
            featureName={item.name}
            featureData={featureData[feature]}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default memo(ListingFeaturesView);
