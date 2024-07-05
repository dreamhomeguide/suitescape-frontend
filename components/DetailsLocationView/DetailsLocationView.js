import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Colors } from "../../assets/Colors";
import style from "../../assets/styles/detailsStyles";
import globalStyles from "../../assets/styles/globalStyles";
import { PHILIPPINES_REGION } from "../../data/defaultLocation";
import { openLocationAuto } from "../../utils/locationOpener";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import ButtonLink from "../ButtonLink/ButtonLink";

const DetailsLocationView = ({ location }) => {
  const [coordinates, setCoordinates] = useState(PHILIPPINES_REGION);

  const mapViewRef = useRef(null);

  useEffect(() => {
    // Do not run when not on iOS
    if (Platform.OS !== "ios") {
      return;
    }

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      if (!location) {
        return;
      }

      try {
        const address = await Location.geocodeAsync(location);

        if (address.length > 0) {
          const { latitude, longitude } = address[0];
          setCoordinates({
            latitude,
            longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
        }
      } catch (error) {
        console.log("Error getting location: ", error);
      }
    })();
  }, [location]);

  const onNavigatePress = useCallback(() => {
    mapViewRef.current?.animateToRegion(coordinates);
  }, [coordinates]);

  const onLocationPress = useCallback(
    () => openLocationAuto(location),
    [location],
  );

  return (
    <View style={style.container}>
      <Text style={style.headerText}>Location</Text>

      {location ? (
        <>
          {/* Show map only on iOS */}
          {Platform.OS === "ios" && (
            <View style={style.locationContainer}>
              <MapView
                ref={mapViewRef}
                style={globalStyles.flexFull}
                region={coordinates}
              >
                <Marker coordinate={coordinates} pinColor={Colors.red} />
              </MapView>

              <ButtonIcon
                renderIcon={() => (
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={24}
                    color={Colors.red}
                  />
                )}
                onPress={onNavigatePress}
                color={Colors.lightgray}
                pressedColor={Colors.gray}
                containerStyle={style.locationButtonContainer}
              />
            </View>
          )}

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
