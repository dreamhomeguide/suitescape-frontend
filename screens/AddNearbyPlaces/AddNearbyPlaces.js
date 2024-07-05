import React, { useMemo } from "react";
import { View } from "react-native";

import style from "../../assets/styles/createListingStyles";
import ListingFeaturesView, {
  FEATURES,
} from "../../components/ListingFeaturesView/ListingFeaturesView";
import { useCreateListingContext } from "../../contexts/CreateListingContext";
import placesNearbyData from "../../data/placesNearbyData";

const AddNearbyPlaces = () => {
  const { listingState, setListingData } = useCreateListingContext();

  const nearbyPlaces = useMemo(
    () =>
      Object.keys(placesNearbyData).map((key) => ({
        name: key,
        isSelected: listingState.nearbyPlaces[key],
        onPress: () =>
          setListingData({
            nearbyPlaces: {
              ...listingState.nearbyPlaces,
              [key]: !listingState.nearbyPlaces[key],
            },
          }),
      })),
    [listingState.nearbyPlaces],
  );

  return (
    <View style={style.featuresViewContainer}>
      <ListingFeaturesView
        data={nearbyPlaces}
        feature={FEATURES.placesNearby}
      />
    </View>
  );
};

export default AddNearbyPlaces;
