import { Alert, Platform } from "react-native";
import * as AppLink from "react-native-app-link";

export const openLocationAuto = (location) => {
  if (!location) {
    return;
  }

  Alert.alert("Open location in:", location, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Google Maps",
      onPress: () => openLocationInGmaps(location),
    },
    {
      text: "Waze",
      onPress: () => openLocationInWaze(location),
    },
  ]);
};

export const openLocationInGmaps = (location) => {
  // Default maps app
  // const scheme = Platform.select({
  //   ios: 'maps:',
  //   android: 'geo:',
  // });
  //
  // const url =
  //   scheme + `${angelesRegion.latitude},${angelesRegion.longitude}?q=Angeles`;
  //
  // Linking.openURL(url).catch(err => console.error(err));

  // Google maps api
  // daddr = destination address
  // saddr = source address
  // q = query search
  // center = show a map\

  return AppLink.maybeOpenURL(
    Platform.OS === "ios"
      ? `googleMaps://app?q=${location}`
      : `google.navigation:q=${location}`,
    {
      appStoreId: "585027354",
      playStoreId: "com.google.android.apps.maps",
    },
  );
};

export const openLocationInWaze = (location) => {
  return AppLink.maybeOpenURL(`waze://?q=${location}`, {
    appStoreId: "323229106",
    playStoreId: "com.waze",
  });
};
