import { Linking, Platform } from "react-native";

const openLocationInGmaps = (location) => {
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

  if (!location) {
    return;
  }
  Linking.openURL(
    Platform.OS === "ios"
      ? `googleMaps://app?q=${location}`
      : `google.navigation:q=${location}`,
  ).catch(() => console.log("Failed to open Google Maps."));
};

export default openLocationInGmaps;
