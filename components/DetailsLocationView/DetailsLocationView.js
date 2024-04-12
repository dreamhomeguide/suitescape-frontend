import React, { memo, useCallback } from "react";
import { Text, View } from "react-native";
import MapView from "react-native-maps";

import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import openLocationInGmaps from "../../utils/locationOpener";
import ButtonLink from "../ButtonLink/ButtonLink";

const angelesRegion = {
  latitude: 15.15999887575342,
  latitudeDelta: 0.10724659348830379,
  longitude: 120.58167931503255,
  longitudeDelta: 0.21333772519169258,
};

const DetailsLocationView = ({ location }) => {
  const onLocationPress = useCallback(() => {
    openLocationInGmaps(location);
  }, [location]);

  return (
    <View style={style.container}>
      <Text style={style.headerText}>Location</Text>

      {location ? (
        <>
          <View style={style.locationContainer}>
            <MapView
              style={globalStyles.flexFull}
              region={angelesRegion}
              // scrollEnabled={false}
              // zoomEnabled={false}
            />
          </View>

          <ButtonLink
            textStyle={{ ...style.text, ...style.link }}
            onPress={onLocationPress}
          >
            {location}
          </ButtonLink>
        </>
      ) : (
        <Text style={style.text}>No location specified.</Text>
      )}
    </View>
  );
};

export default memo(DetailsLocationView);
