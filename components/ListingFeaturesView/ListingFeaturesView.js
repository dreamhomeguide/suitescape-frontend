import React, { memo, useCallback, useEffect, useState } from "react";
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

const FEATURE_DATA = {
  [FEATURES.amenities]: amenitiesData,
  [FEATURES.placesNearby]: placesNearbyData,
};

const ListingFeaturesView = ({ feature, data, size = 6, fullMode = true }) => {
  const [validFeatures, setValidFeatures] = useState([]);

  const renderItem = useCallback(
    ({ item }) => (
      <ListingFeatureItem
        featureName={item.name}
        featureData={FEATURE_DATA[feature]}
        isSelected={item.isSelected}
        onPress={item.onPress}
      />
    ),
    [],
  );

  useEffect(() => {
    const getValidFeatures = () => {
      if (!data) {
        return [];
      }
      const validator = FEATURE_DATA[feature];
      return data.filter(({ name }) => validator[name]);
    };

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
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={style.contentContainer}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

export default memo(ListingFeaturesView);
